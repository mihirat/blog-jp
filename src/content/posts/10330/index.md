---
title: PythonのKubernetes clientでGKEのクラスタにデプロイする
tags: ["kubernetes", "python"]
published: 2018-09-30
category: Tech
draft: false
---

またGKEネタです。

## kubernetes clientについて

kuberentesをプログラミング言語で操作するためのものです。普段 kubectl コマンドで操作している内容ですね。
JS, Python, JavaはGAっぽくて、Golang, Haskell, RubyあたりはWIPのようです。
[https://github.com/kubernetes-client](https://github.com/kubernetes-client)
[Python製](https://github.com/kubernetes-client/python)が一番スター数が多く、そろそろ1000くらいですね。

しかしながら、このチュートリアルが、ローカルから叩く場合くらいしか考慮されてないため、本記事で説明します。

## What to do

1. k8sクラスタのAPI serverのエンドポイントとCertificateを確認
2. k8sのservice accountを作成し、認証Tokenを確認
3. Pythonコードからk8s APIを叩く

### 1\. k8sクラスタのAPI serverのエンドポイントとCertificateを確認

最初完全に勘違いしていたんですが、GKE上にあるk8sクラスタへの接続にGCPのサービスアカウントなどは一切不要です。
マスターノードやetcdには確かにアクセスできませんが、API serverにさえアクセスできれば操作はできます。
[そもそもAPI serverとの接続ってどうなってるのか](https://kubernetes.io/docs/tasks/administer-cluster/access-cluster-api/) は説明があるので、一読しておくと良いです。

ということで、まずクラスタの認証情報などを確認します。
いずれもGKEのコンソールから確認できます。[この記事のスクリーンショット](https://qiita.com/zaru/items/bf5b4e60ad4d67be8bea)がわかりやすいです。

### 2\. k8sのservice accountを作成し、認証Tokenを確認

[認証方式は複数ある](https://kubernetes.io/docs/reference/access-authn-authz/authentication/)のですが、手っ取り早いものを採用します。

k8sの内部にはservice accountというGCPのそれと似た概念があるのですが、このアカウントに適切な権限を付与して利用します。

* ServiceAccount: アカウント
* Role: 権限の定義
* RoleBinding: Roleをアカウントに紐付けるという宣言

この3つを作成して、権限を持ったアカウントを作成することができます。
もしクラスタ全体にまたがった操作をする場合（ノードの状態を見る、クラスタ内の全podを確認するなど）は、

* ClusterRole: クラスタ全体に関わる権限の定義
* ClusterRoleBinding: ClusterRoleをアカウントに紐付けるという宣言

が別に存在します。
複数のnamespaceが存在する場合は、互いの誤干渉を防ぐため、できるだけnamespaceに閉じた権限を発行するのがよいでしょう。

[公式を参考](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)に、こんな感じで発行できます。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: my-k8s-client
  namespace: my-k8s-ns
rules:
- apiGroups: [“”] # “” indicates the core API group
  resources: [“pods”, “services”]
  verbs: [“get”, “list”, “watch”, “create”, “update”, “patch”, “delete”]
- apiGroups: [“extensions”]
  resources: [“deployments”]
  verbs: [“get”, “list”, “watch”, “create”, “update”, “patch”, “delete”]
- apiGroups: [“autoscaling”]
  resources: [“horizontalpodautoscalers”]
  verbs: [“get”, “list”, “watch”, “create”, “update”, “patch”, “delete”]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: my-k8s-client
  namespace: my-k8s-ns
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: my-k8s-client
subjects:
  - kind: ServiceAccount
    name: my-k8s-client
    namespace: my-k8s-ns
```

Roleだけちょっと面倒なんですが、Resourceが操作したい対象、apiGroupsがそれを操作できるAPIのカテゴリ（documentをめっちゃ見る）、verbsが許可する操作内容です。

これを `kubectl apply` してservice accountが作成できたら、

```
kubectl get secrets --namespace=<namespace_name>kubectl describe secret
```

で、デプロイしたservice accountのTokenを取得します。`ey~~~` の長い一行の文字列です。

### 3\. Pythonコードからk8s APIを叩く

準備が全て終わったので、実際にAPIを叩いてみましょう。

```python
from kubernetes import client
import yaml

# init
configuration = client.Configuration()

# step2で取得したTokenを記述
configuration.api_key["authorization"] = '<bearer_token>' 
configuration.api_key_prefix['authorization'] = 'Bearer' # step1で取得したAPI serverのエンドポイント 
configuration.host = 'https://<ip_of_api_server>' # step1で取得したAPI serverのCertificate。文字列では渡せなさそう 
configuration.ssl_ca_cert = '<path_to_cluster_ca_certificate>' # api叩くインスタンス生成 

v1 = client.CoreV1Api(client.ApiClient(configuration)) # とりあえずpodを見てみる 
print(v1.list_namespaced_pod(namespace=my-k8s-ns)) # デプロイするときは別のapiインスタンス。まだbetaを使っている 
deploy_api = client.ExtensionsV1beta1Api(client.ApiClient(configuration)) # 定義したyamlを使ってdeploymentを作成 
with open('path/to/deployment.yaml') as f:
    nice_dict = yaml.load(f)
resp = deploy_api.create_namespaced_deployment(body=nice_dict, namespace=my-k8s-ns)
```

pseudo codeですが、だいたいこんなので動作します。
`kubectl apply` 相当の処理が必要な場合は、`deploy_api.patch_namespaced_deployment` を使って try-exceptして実装します。

Basic認証などもありますが、チュートリアルには説明がないので[実装を見ながら](https://github.com/kubernetes-client/python/blob/master/kubernetes/client/configuration.py#L84)頑張る感じになります。

チュートリアルの多くは`config.load_kube_config()` を使えばokと結論づけているのですが、
programaticにアクセスするときにはやはり上記の手順を踏むべきかなと思いました。

なお、今回の記事は
[stackoverflowの投稿](https://stackoverflow.com/questions/48151388/kubernetes-python-client-authentication-issue)を参考に補足などしたものです。
大変助かりました。
