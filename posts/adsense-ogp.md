---
title: GatsbyでGoogle AdsenseとOGPを対応
description: プラグインの注意点などまとめ
tags: ["gatsby"]
published: true
date: '2021-08-15'
---

しばらく放置してましたが、対応未了だった２タスクにちょっと詰まったので共有。

## Google Adsense

### やること

1. Adsenseの申し込み
1. Adsense用jsファイルの設置
1. Googleの審査を受けてパスする
1. Adsenseのスロットを作成
1. Adsense用コンポーネントを配置

注意点としては、gatsby-plugin-google-adsenseとreact-adsenseのいずれも使わないことです。

いずれも長期間更新が途絶えています。

- https://github.com/hustcc/react-adsense
- https://github.com/IsAmrish/gatsby-plugin-google-adsense

#### Adsenseの申し込み

下記公式リンクから申し込みましょう。指示に従っていくと、審査を受けるための方法が提示されます。

https://support.google.com/adsense/answer/10162?hl=ja

#### Adsense用jsファイルの設置

GatsbyJSのhtml.js配置を使って、指示された通りの`<head>`タグを埋め込みます。
環境変数に格納して実装しました。

参考：
- [GatsbyJSで作ったブログがGoogle AdSenseの審査に通ったので広告を組み込む](https://gan0803.dev/blog/2020-06-15-google-adsense)
- [このブログに実装したPR](https://github.com/mihirat/blog-jp/pull/23/files#diff-023eb4be0e5096f5a778ef1dfee421162b529c473ad2c2c7f3e12534eeaa44b7)


#### Googleの審査を受けてパスする

埋め込んだブログをデプロイして、審査ページから審査依頼をします。
このブログは２日ほどでokがでました。

#### Adsenseスロットの作成

広告のレイアウトなどを決定します。

#### Adsense用コンポーネントを配置

作成したスロットのIDなどを反映したコンポーネントを作成し、ブログに貼り付けます。
参考ブログ同様に、ブログの記事の一番下にだけ表示するようにしました。

プラグインを使わないため、自前でコンポーネントを作成します。
こちらもIDなど環境変数に格納して実装しました。
[このブログに実装したPR](https://github.com/mihirat/blog-jp/pull/23/files#diff-12460898c6a133693bb3b3793470936ca395ea6e506e71945fa13f775f41dfa5)


AdBlockerなど使用していなければ、この記事の最後に広告欄が出ているはずです。

開始一週間で１円の儲けが出ました。一年でうまい棒が５本も手に入ります。

---

## OGP

SNSでリンクを貼ろうとするときに、勝手に画像やらタイトルやらを取得してくれるやつです。
Twitterをよく使うので反映しておきました。

### やること

1. SEOコンポーネントなど、Metaタグコンポーネントの設定
1. OGP確認ツールでの確認

#### SEOコンポーネントなど、Metaタグコンポーネントの設定

このブログはgatsby-starter-blogから始めたので、component/seo.jsにmetaタグ関連が入ってます。
やるべきだったことは、`og:image` などのタグの設定。

このブログで修正したPRの該当箇所は[こちら](https://github.com/mihirat/blog-jp/pull/24/files#diff-46bb1d99a93bc5b6f63d50361abac9cc4c09038b92b77536c85a93ff2f8fc401R76)

なお、埋め込むべき画像のURLは外部アクセス可能なURLにしなければいけないので、

https://rpf-noblog.com/2020-07-01/gatsby-ogp-image/

などを参考にして修正します。
このブログで修正したPRの該当箇所は[こちら](https://github.com/mihirat/blog-jp/pull/24/files#diff-46bb1d99a93bc5b6f63d50361abac9cc4c09038b92b77536c85a93ff2f8fc401R31)

#### OGP確認ツールでの確認

実際にシェアしたときにどんなOGPが出るかの確認ができます。
Netlifyだったらプレビューサイトのリンクを貼ってみると確認できるので、少し時間を置いて試します。

https://ogp.buta3.net/


下のtwitterボタンを押してみると、画像やタイトルが出てくることでしょう。

そのままシェアしていただいて大丈夫ですよ。

