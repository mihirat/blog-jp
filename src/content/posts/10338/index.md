---
title: Istioで複数FQDNのホスティング
tags: ["istio", "kubernetes"]
published: 2018-10-14
category: Tech
draft: false
---

Istioで複数アプリケーションのホスティングするのに詰まったので、記事にしておきます。
Istio自体の導入については[前回の記事](http://techeten.xyz/10305)などをご参考ください。

## 問題

前回の記事で導入したのと同じように

* 別のNamespaceを新たに作成し、Istio injectionを有効化
* そこに新しいFQDN用のGatewayとVirtualServiceを作成

して、新しいFQDN用のリソースをIstioで受けられるようにしたかったのですが、どうしてもできないのです。

いろいろ試して実験してみたところ、

* VirtualServiceは、自分が所属するNamespace内に存在するGatewayにしか紐づけできない
* 複数のGatewayを複数のNamespaceにデプロイすると、最初にデプロイしたGatewayに記載のあるFQDNしか名前解決ができない

ということがわかりました。

異なるアプリケーションは別のNamespaceで管理したかったため、全部を一つのNamespaceで管理することは避けたく、原因を調査しました。
(全て同じNamespace内にデプロイする方法は[公式のドキュメントに記載があります](https://preliminary.istio.io/docs/tasks/traffic-management/secure-ingress/#configure-a-tls-ingress-gateway-for-multiple-hosts))

## 原因: GatewayリソースはNamespace間で共通

今回の問題の調査として大いに参考になったのが[こちらのGoogle groupのディスカッション](https://groups.google.com/forum/#!topic/istio-users/QFUcc4AV4Jk)。

> gateways are not namespaced -they are common across all namespaces.

これが全てでした。Gatewayは複数デプロイすると互いに干渉するようです。
([Issue](https://github.com/istio/istio/issues/6046)も立っていますが、仕様かバグかよくわからない)

じゃあNamespace分割するにはどうしたらいいんだ…？と思ったのですが、kube-dnsを使えば解決できます。
k8s内のリソースの名前解決は

```yaml
<service-name>.<cluster-namespace>.svc.cluster.local
```

が使えるので、これをVirtualService > destination > host に記載すれば、Namespaceをまたいでサービスディスカバリが可能になります。

コードでは下記の感じです。

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
 name: common-istio-gateway
spec:
 selector:
   istio: ingressgateway # use istio default controller
 servers:
 - port: #マルチドメインの場合は、certificateなどを別名で(another-tls.crtなど)Secretとしてデプロイし、この項目を増やしていく
     number: 443
     name: https
     protocol: HTTPS
   tls:
     mode: SIMPLE
     serverCertificate: /etc/istio/ingressgateway-certs/tls.crt
     privateKey: /etc/istio/ingressgateway-certs/tls.key
   hosts:
   - my-app1.example.com
   - my-app2.example.com
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
 name: my-app1
spec:
 hosts:
 - my-app1.example.com
 gateways:
 - common-istio-gateway
 http:
 - route:
   - destination:
       host:
         my-service1.my-app1.svc.cluster.local
       port:
         number: 80
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
 name: my-app2
spec:
 hosts:
 - my-app2.example.com
 gateways:
 - common-istio-gateway
 http:
 - route:
   - destination:
       host:
         my-service2.my-app2.svc.cluster.local
       port:
         number: 80
```

Namespaceをまたいで共通のリソースなので、全てdefault namespaceにデプロイすることにします。
これで無事マルチホスティングができました。

## 補足

さきほどのディスカッションにて

> Also, I would suggest launching different gateway controllers for each gateway spec, instead of adding multiple gateways to the same controller (istio: ingressgateway).

ということが述べられており、Controllerを複数作成することで複数Gatewayも可能のようですが、まだ試していません。
