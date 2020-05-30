---
title: Slackで全ての情報収集を一元化
category: "slack"
cover: wineman.png
author: mihirat
---

新年で時間がとれたので、ずっとやりたかった情報収集の一元化に取り組みました。
N匹目のドジョウなので、HowTo集にしてコンパクトにお送りします。

## 情報収集で困ることあるある

* いろんなとこにメモしてしまい、どこにあったか忘れてアクセスできなくなる
* twitter、誰かのブログ、あのwebサイト、メール、イベント情報、バラバラなのでまとめてみたい
* 仕事以外の普通のニュースもまとめたい(SmartNewsとかだと、気がつくと娯楽記事に流れがち)
* 自分のメモもまとめたい
* 通知来てほしい

という悩みを一挙に解決するのがSlackまとめ。
「slack 情報収集」などぐぐるといろんな人がすでに着手しています。

https://blog.ruucb.com/2017/01/139

https://businesschatmaster.com/slack/rss-johoshushu

https://www.yururito.net/entry/collect-information-from-slack

## すでにまとめてあるものもある

ITエンジニアだとモヒカンが有名ですね。

https://qiita.com/kotakanbe@github/items/32cf4eb3de1741af26fb

自分のほしい情報と違ったのと、個人的なメールも共有したかったのでやめました。

## それぞれ連携していく

### ブログやウェブサイト => RSS

登録方法はこちらによくまとまってます

https://businesschatmaster.com/slack/rss-johoshushu

どうやってRSSのフィードを探すかは、こういったまとめを探してみるのがよさげ。
例えばNewsサイトだと

https://rss.wor.jp/

### Twitterの発言 => Twitter, IFTTT

Slack公式だと人単位でしか発言が取れないので、IFTTTの方がハッシュタグやキーワードなどより柔軟に取れます。

https://qiita.com/will_meaning/items/3da09472a0963c85fe65

## ほしい情報を簡単に連携する方法が見つからない場合

### 1\. そのサイトのfeedを探してみましょう

こういうサイトでポチポチ探せますが、

https://berss.com/feed/Find.aspx

Chromeの拡張を使うのが楽ですね。

https://github.com/shevabam/get-rss-feed-url-extension

### 2\. 無いモノは作ってみましょう

一時期流行ったIFTTTでやれば、大体欲しいものは連携できます。
多くのサービスはメールは飛ばせると思うので、IFTTTのGmail連携 => Gmailのフィルタ使って通知設定使えば、大体いける気がします。
gmailのフィルタを作成するのは、sqlライクな感じでできます

https://support.google.com/mail/answer/7190?hl=en

例えば自分の場合だと、connpassのイベント情報を簡単に取る方法がよくわからなかったので、Gmail + IFTTTで連携。
「募集が始まりました」というワードでフィルタを作ってみました。

Google Alertを使うと、検索キーワードを指定しておけば、そのキーワードでよしなに盛り上がったものを抽出してくれるらしいです。

https://hawaiisukiweb.net/life/2193

あとはGoogle App Scriptとかですかね。例えばQiitaのトレンドなんかは、人やタグ単位以外はRSSがないっぽいので、このへん使って自作する必要がありそうです。

https://qiita.com/nomotohiroki/items/a0492e0716fff0e5212e

### 3\. さらなる高みへ

slack botを作れば連携できないものなんてないのでした。

https://kusanohitoshi.blogspot.com/2017/05/slackbot.html

今年もゆるゆると続けていきます。どうぞよろしくお願いします〜