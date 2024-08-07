---
title: Google App Engineで複数serviceに対してcronを設定する
tags: ["gae", "gcp"]
published: 2017-07-18
category: Tech
draft: false
---


Google App Engineの便利な機能、スケジュール機能。
これはApp Engineで作成されたアプリ自体に対して定期的にアクションを設定できるものですが、これを複数serviceと組み合わせるときの解決策がパッと見つからなかったので解決策をメモ。

### スケジュール機能とは

>App Engine Cron サービスを使用すると、定義された時刻または一定間隔で動作する定期スケジュール タスクを設定できます。これらのタスクは、一般的に cron ジョブ と呼ばれています。cron ジョブは App Engine Cron サービスによって自動的にトリガーされます。たとえば、これを使用して、毎日レポートメールを送信したり、 10 分ごとに一部のキャッシュされたデータを更新したり、 1 時間に 1 回概要情報を更新することができます。

[公式より。](https://cloud.google.com/appengine/docs/flexible/nodejs/scheduling-jobs-with-cron-yaml?hl=ja)

使い方としては

1. cron.yamlを作成
1. `$ gcloud app deploy cron.yaml` などでデプロイ
だけです。

cron.yamlのサンプルは公式ページにたくさんありますが、簡単にまとめると

```yaml
- description: new daily summary job
  url: /tasks/summary  // 定期実行したい、アプリに存在するhandler
  schedule: every 24 hours // スケジュール間隔の設定。自然言語っぽい
  timezone: Asia/Tokyo // timezone
  target: beta // これがなんか公式のdocと挙動が違う気がする
```

以上です。 targetだけちょっと挙動が不明で、

>target 文字列は、アプリのホスト名の先頭に追加されます。通常、これはサービス名です。cron ジョブは、指定されたサービスのデフォルト バージョンにルーティングされます。サービスのデフォルト バージョンが変更された場合、ジョブは新しいデフォルト バージョンで実行されることに注意してください。

って書いてあるんですが、複数のserviceが存在するときに、あるserviceをtarget名に記載してもそちらにcronが設定されないような気がします。
[stack overflowの報告](https://stackoverflow.com/questions/18162798/how-do-i-make-cron-work-with-a-specific-app-engine-module)などにあるように、できる人とできない人がいるらしい…？

複数のserviceと言っているのは、app.yaml内で `service: hoge`みたいに設定すると <https://hoge-dot-your-project.appstpot.com> みたいにGAEアプリを生成した場合を指します。
以前は module と呼ばれていた機能。

ちょっと試しただけなので確実なところは不明ですが、確実にcronからserviceを指定する方法としては以下になります。

### 1\. アプリごとにhandleするURLパスを互いに異なるように変更する

GAEアプリAとBを作るとします。
アプリAでは

```yaml
service: a
```

アプリBでは

```yaml
service: b
```

のように設定すると複数serviceに分かれます。このあと、それぞれのアプリ内のhandlerを

```go
func init() {
    http.HandleFunc("/appliA", mainHandler)
}
```

```go
func init() {
    http.HandleFunc("/appliB", mainHandler)
}
```

のように、同じパスにURLハンドラを設定しないようにします。でデプロイします。

### 2\. dispatch.yamlを設定する

`dispatch.yaml` とは、URLパスごとにどのサービスに振り分けるか設定できるもの。L7ロードバランサ的なものと理解してます。
[公式](https://cloud.google.com/appengine/docs/standard/python/how-requests-are-routed#routing_via_url)
これを使って

```yaml
dispatch:
  - url: "*/appliA"
    service: a
  - url: "*/appliB"
    service: b
```

のように設定して、同じように  `$ gcloud app deploy dispatch.yaml` などでデプロイします。

### 3\. cron.yamlを設定する

```yaml
- description: appli A daily job
  url: /appliA
  schedule: every 24 hours
  timezone: Asia/Tokyo
- description: appli B  daily job
  url: /appliB
  schedule: every 24 hours
  timezone: Asia/Tokyo
```

と設定して、cronの設定がserviceごとに分離できました。

### 以上

それなりに詰まりました。 App Engineはググると古い情報がヒットしやすいので、何かの参考になれば幸いです。

[参考](https://cloud.google.com/appengine/docs/flexible/python/configuration-files)
