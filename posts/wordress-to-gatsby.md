---
title: WordPressからGatsby+Netlifyへ移行しました話
description: GatsbyとNetlifyで無料ホスティングに切り替えました
tags: ["gatsby"]
published: true
date: '2020-06-14'
---

移行しました！

# なんで

- WordPressしんどい問題

メンテする気がいっさい起きないです。遅い、deprecatedだらけなライブラリ、遠い昔に設定したURLの正規表現置換、etc。。。
使い方が悪いんだと思いつつ。

- https対応

さすがにこのご時世にhttpはだめだよな〜〜と思ってました。とはいえ、Let's Encryptを自前で運用する気にもならず。

- VPSのメンテ問題

遠い昔に借りたVPSでWordPress動かしてたのですが、いろいろとEOLだったり、他の用途にがっつり使いたくなったり。

- Reactしたい

最近React.jsを業務で使い始めたので、もう少し個人でも触るタイミングを作りたく。

- Netlifyしたい

なんかすごいらしい！！！！！で止まってたので触ることに。

ということで移行しました。
先達がたくさんいたので、主に下記ブログを参考に移行対応しました。

Gatsbyを使ったブログ構築メモ
https://greendiver234.com/gatsby-blog-getting-started-1/


以下はその紹介です。


## やること・やらないこと

#### やる

- ドメイン移行
- NetlifyでのCI/CD
- Gatsby対応

#### やらない

- Gatsbyのテーマ構築（後日やるかも。とりあえず移行して旧環境を捨てることが第一）
- 全記事の移行（変換がめんどくさい）
- 記事のフォーマット修正（そこまでやる時間がない）
- CMSの設定（Markdownでかければなんでも良い）

## 1. WordPress記事のエクスポート、md変換

https://greendiver234.com/gatsby-blog-getting-started-1/


## 2. Gatsbyのtemplateに記事配置

md対応のテンプレートを選んで、あとは記事通り。
https://greendiver234.com/gatsby-blog-getting-started-2/


## 3. config.jsなどの修正

自分が選んだテンプレートにはLinkedInなどのアイコンが入ってたので、
それらをいい感じに修正。
https://greendiver234.com/gatsby-blog-getting-started-3/


## 4. NetlifyでのCI/CD設定とホスティング

CI/CDが最初からついてきて、
ホスティングは爆速、
SSLもok。
次何か作るときはNetlifyを使う気がします。Netlifyはすごい。


https://greendiver234.com/gatsby-blog-getting-started-4/


## 他に参考にしたブログ

- [WordpressブログをGatsby+Netlifyでリプレースした話。](https://ver-1-0.net/2019/01/10/blog-renewal-by-gatsby)

- [WordPressやめます Gatsbyに移行しました](https://tech-blog.s-yoshiki.com/entry/192)

- [7年間使ってきたWordPressを捨ててContentful+Gatsby+Netlifyにしたら爆速になったし経緯とか教訓とか語る](https://qiita.com/kfurumiya/items/d0f4a327318b88bd6199)

- [ブログをWordpressからGatsbyに移行したので、その手順とハマったポイントを解説する](https://qiita.com/akashixi/items/9653d0a6522117618e0f)
