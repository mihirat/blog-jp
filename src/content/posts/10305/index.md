---
title: Istio入門：既存のGKE上アプリケーションにIstioを導入するまでの流れ
tags: ["istio", "kubernetes", "gcp" ]
published: 2018-09-19
category: Tech
draft: false
---


社内でIstioを導入した際に、チュートリアルなどではわかりにくいハマりポイントや、既存GKEクラスタの導入にあたって留意すべき点がけっこうあるなと思ったのでまとめます。

対象読者は

* GKEですでにサービスなどを運用している
* Istioの概要は知っている、またはチュートリアルは終わった

くらいの方を想定しています。

なお、Istioとはなにかを解説する記事はすでにたくさんあるので、できるだけ作業レベルで導入の仕方を解説していきます。
Istioを知るハンズオンとしては、Googleの中の方の[Istio 1.0 を試してみた！](https://medium.com/google-cloud-jp/istio-1-0-%E3%82%92%E8%A9%A6%E3%81%97%E3%81%A6%E3%81%BF%E3%81%9F-d74f75eeb1b1)などが良いです。

## 移行したいアプリの構成

もともとの構成はこんな感じでした。

* GCP上でglobal IPを取得し、FQDNと紐づけて外部流入をさせる
* トラフィックはIngressで受けており、SSL terminationを行う
* Ingressの次にNginxがあり、バックエンドのpodへkube-dnsを用いてリバースプロキシさせる
* バックエンドのpodでは、GCSにアクセスしてリソースを取得するなどの処理をしつつレスポンスを返すサーバーが動作

なお、下記の手順は、クラスタを別で新しく作成して、そこにIstioを導入する想定で進めます。

既存クラスタ上で作業するとダウンタイムが出る危険性が高い気がします。
（namespaceを既存と別に切ればいいような気もしますが、既存namespaceに影響が出ないかを自分は確認していません）

## やることの流れ

1.　クラスタ作成
2.　クラスタへのIstio導入と、namespaceへの有効化
3.　namespace内へのリソースのデプロイ

## 準備

本家のチュートリアルに沿って、Istioを導入します。
利用するのは

`$ kubectl apply -f install/kubernetes/istio-demo.yaml`

です。
istio-demo-auth.yamlでは、mutualTLSといってpod間の通信が全てTLSになって最高！に見えるのですが、readiness probeとliveness probeが使えなくなります
[サービスが動いているportとは別にprobe専用のportを空けるという話](https://github.com/istio/istio/issues/2628)もありますが、それってReadinessの意味がないような？

無事にIstioが導入できたら（サンプルアプリのデプロイまで行ってしっかり確認しましょう）、既存アプリをデプロイするためのnamespaceを作成します。

それが終わったら、下記コマンドでnamespace全体に対してIstioを有効化します。

`$　kubectl label namespace my-app istio-injection=enabled`

この操作によって、このnamespace内で以後作成されるpodは全て、
Istioで利用されているEnvoyをsidecarとして自動的に注入された状態で立ち上がることになります。
この機能はkubernetes1.9以上じゃないと使えません（kubernetesのpod initializerを利用しているため）

## 知るべきこと1\. IstioではIngressは使わない

最初にして最大の難関。
IstioではIngressは使わず、Istio独自のGatewayとVirtualServiceというリソースを用います。（後述）

(0.8からこうなったらしく、２０１７年の記事を読むと混乱します。後方互換性のためか公式にもまだIngress関係のリソースが残っていますが、使わないべきです。[参考](https://github.com/istio/istio/issues/1024))

その理由としては、IngressではIstioのもつ機能が全部活用できない、とのこと。

>In a Kubernetes environment, the Kubernetes Ingress Resource is used to specify services that should be exposed outside the cluster. In an Istio service mesh, a better approach (which also works in both Kubernetes and other environments) is to use a different configuration model, namely Istio Gateway. A Gateway allows Istio features such as monitoring and route rules to be applied to traffic entering the cluster.

[本家より](https://istio.io/docs/tasks/traffic-management/ingress/#determining-the-ingress-ip-and-ports-when-using-a-node-port)

で、そのアオリというわけではないんですが、GCPのglobal IPがIstioでは使えません。しばらくはサポートする予定もないみたいです。

暫定では、ServiceのLoadbalancerIPを用いてくれ、という回答。

>Per our chat, it is possible to set the load balancer IP in a LoadBalancer service (search for loadBalancerIP on <https://kubernetes.io/docs/concepts/services-networking/service/>). This can be set to a regional static IP but not global static IP - this is limited in Arcus and there's no plan to support global. The missing part is that you have to use the actual IP address instead of a nice label like you can with an Ingress (kubernetes.io/ingress.global-static-ip-name: my-static-ip).

[Issue](https://github.com/istio/istio/issues/3800)

なので、Ingressで行っていた下記のような書き方はできません。SSL　terminationも別のところでやる必要があります。

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: my-app
  annotations:
    kubernetes.io/ingress.global-static-ip-name: "gad-my-app" # 使えない
    kubernetes.io/ingress.allow-http: "false"
    ingress.gcp.kubernetes.io/pre-shared-cert: "myapp-cert"　# 使えない
```

ということで、Ingressで構成を作ってしまっていた場合、IPアドレスの受け先を変更する必要があるため、blue-greenデプロイで既存GKEアプリを移行することになるかと思います。

以下、これを実行していきます。

### Regional IPを使って、IstioのServiceのLoadBalancerIPにpatchを当てる

k8sのServiceでは、LoadBalancerIPを既存IPに張り替えることで、そのServiceでそのIPアドレスのトラフィックを受けることができます。

Istioをクラスタに導入すると、istio-systemというnamespaceにistio-ingressgatewayというk8sのServiceリソースが作成されます。

Istioを導入したクラスタ１つにつき静的IPアドレスを一つ用意して、そのIPをistio-ingressgatewayに割り当てます。
具体的には

`$ kubectl patch svc istio-ingressgateway --namespace istio-system \ --patch '{"spec": { "loadBalancerIP": "your-reserved-static-ip" }'`

です。[KnativeのReadme](https://github.com/knative/docs/blob/master/serving/gke-assigning-static-ip-address.md)を参考にしました。

これで、IPアドレス宛に来たトラフィックは全てIstioのLBを通って来ます。

### SSL　termination周りのリソースをsecretとしてデプロイ

Ingressで実行していたterminationは、前述のGatewayで行うことになります。
流れとしては、まずsecretをデプロイします。

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: istio-ingressgateway-certs # 予約語
  namespace: istio-system
type: Opaque
data:
  tls.key: my-key-base64
  tls.crt: my-crt-base64
```

これで証明書などをIstioのnamespaceにデプロイして、Gatewayから呼び出します。
Gatewayは下記のように記述して、 `$ kubectl apply -f gateway.yaml`　でデプロイします。

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: my-gateway
  namespace: my-app
spec:
  selector:
    istio: ingressgateway # use istio default controller
  servers:
  - port:
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE
      serverCertificate: /etc/istio/ingressgateway-certs/tls.crt # 合わせる
      privateKey: /etc/istio/ingressgateway-certs/tls.key # 合わせる
    hosts:
    - dev.my-app.com
```

このあたりは[本家を参照](https://istio.io/docs/tasks/traffic-management/secure-ingress/#configure-a-tls-ingress-gateway)すると出てきます。

Gatewayはあくまでもトラフィックを受けるためだけのリソースで、受けたリソースをどこに流すかはVirtualServiceが担当します。

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: my-virtualservice
  namespace: my-app
spec:
  hosts:
  - dev.my-app.com
  gateways:
  - my-gateway
  http:
  - route:
    - destination:
        host:
         my-nginx # my-nginxのk8s Serviceに対してトラフィックを流す
        port:
          number: 80
```

## 知るべきこと2\. Istio内部ではHTTP/1.0は利用できない

「まだ1.0とかありえないしｗ」と思われる方もいるかもしれませんが、Nginxのproxy_passのデフォルト設定では1.0になっています。
1.0のままだと、Nginxからの疎通自体はできるものの、Statusコードが426になって返ってきます。
[該当Issue](https://github.com/envoyproxy/envoy/issues/2506)

Istio公式のQuickstartより。

> Note: The application must use HTTP/1.1 or HTTP/2.0 protocol for all its HTTP traffic because HTTP/1.0 is not supported.

なので、Nginxの場合は

> proxy_http_version 1.1;

などを定義してやる必要があります。

なお、kube-dnsが適切に動作していれば、

`proxy_pass http://service-name.cluster-namespace.svc.cluster.local`

などは引き続きそのまま利用できます。
[本家チュートリアル内でデプロイされるサンプルアプリ](https://github.com/istio/istio/blob/master/samples/bookinfo/src/productpage/productpage.py#L54)も参考になります。

## 知るべきこと3\. APIなど外部通信は全てHostnameなどで穴あけが必要

個人的に一番詰まったのはここでした。
Istioでは、通信する外部ホストの全てをリストアップして記述してやる必要があります。
例えば、`pip install`をする場合は`pypi.org`、google apiを利用する場合は`www.googleapi.com`など。
詳細は[こちらの本家記事](https://istio.io/blog/2018/egress-https/)を読まれることをおすすめします。

今回想定しているアプリでは、Google Cloud Storageと通信するので、
利用するAPIのホストとプロトコルは下記の２つ。

* <https://storage.googleapi.com>
* <http://metadata.google.internal>

しかしながら、metadata.google.internalには罠があり、生IPを記述しないとcloud storage apiが使えないという問題が。
[該当Issue](https://github.com/istio/istio/issues/5288)

一方で、生IPではなくA recordを要求する場合もあるようです。
自分は GKEのVMのdefault credentialsを取得する際に、そこで

```
503 Failed to retrieve http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/?recursive=true
```

のようなエラーが表示されてしまったのですが、これはFQDNを併記することで解決しました。
これらを用いて、下記のように記述して`kubectl apply -f external.yaml`　などでデプロイします。

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: ServiceEntry # Egress相当の役割をもつリソース
metadata:
  name: external-google-api
  namespace: my-app
spec:
  hosts:
  - "*.googleapis.com" # wildcardが使える
  - 169.254.169.254 # metadata.google.internalのIPアドレス
  - "metadata.google.internal" # 併記
  location: MESH_EXTERNAL
  ports:
  - number: 443
    name: https
    protocol: HTTPS
  - number: 80
    name: http
    protocol: HTTP
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService # ServiceEntryに対応するIngressを記述
metadata:
  name: gcs-tls
  namespace: my-app
spec:
  hosts:
  - "*.googleapis.com"
  tls:
  - match: # 他にもhostがある場合、複数のsni_hostsとdestinationのペアを書く必要があるようだ？
    - port: 443
      sni_hosts:
      - "storage.googleapis.com"
    route:
    - destination:
        host: "storage.googleapis.com"
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService　
metadata:
  name: metadata-http
  namespace: my-app
spec:
  hosts:
  - "metadata.google.internal"
  http: # プロトコルがhttpの場合はこちら
  - route:
    - destination:
        host: "metadata.google.internal"
        port:
          number: 80
```

これでようやく、最初の構成のアプリケーションがIstioを導入した状態で動作するようになりました。
まだまだ初心者ですが、これから知見を貯めていきます。
