---
title: 自分専用のVPNサーバーを構築
description: さくらVPSでレンタルしたサーバーでVPNを構築しました
tags: ["vpn"]
published: 2020-06-20
category: Tech
draft: false
---

## 背景

#### 1. 日本で契約してたサービスが使えなくなった

当初はフリーのOpenVPNとVPN gateを利用していたのですが、それらも対策されて使えなくなりました。

調べるかぎり、大手のVPNサービスは有料無料かかわらず使えなくなったようです。
ただ、それらは多数が単一IPに相乗りしている場合のみ対応されているようです。

#### 2. 無料のVPNサービスは制約が多い

- 日本にサーバーがない
- セキュリティ観点が怪しい
- 速度がでない

などなどが悩みでした。
有料は月額1000円くらい課金が必要になるケースが多いです。悔しい。

よく考えたら自分はエンジニアだったので、作ることにしました。

2hくらいで終わります。

## 1 必要なものを揃える

サーバー、固定IP、root権限あたりが必要です。
例えばさくらVPSのミニマムプランを契約すると揃います。645円。
下記手順ではUbuntu18.04を想定してます

なお、さくらVPSだとパケットフィルタという機能で
portへの通信が制御されていたりするので、外しておきましょう（めちゃ詰まった）

## 2 VPSサーバーをインストール

下記手順をそのままなぞればいいのですが、一部追加事項があります。

[自分だけのVPNサーバを作る！Ubuntu 18.04 に SoftEther VPN Serverをインストール](https://qiita.com/dogwood008/items/3d11ea67661a5b6bc59d)

- インストールするアプリはrtmかつlatestを選ぶ

記事内だと betaかつ少し古いものを使っているので、最新版を確認しましょう。
執筆時点だと

>SoftEther VPN Server (Ver 4.29, Build 9678, rtm)

ですね。[SoftEther Download Center](https://www.softether-download.com/en.aspx?product=softether)
で確認できます

- セキュリティ対応

記事内で`ufw`コマンドで開放ポートの操作をするタイミングがありますが、
SSHが全開放されているのはよろしくないので、何かしらか対応しましょう。

雑にIPでしばるなら`ufw allow from my.own.address.ip/32 to any port 22`、
ちゃんとやるならpemを発行する方がより安心ですね。

- OpenVPN対応 (必要なら)

記事内の手順だとOpenVPNが利用できないので、利用する場合は
`ufw allow 1194/udp`
などで開放しておきます。

OpenVPN用の設定ファイルは下記コマンドで生成できるので、scpなどでローカルに持っていきます。
> OpenVpnMakeConfig ~/openvpn_config.zip

[参考](https://www.vpsserver.com/community/tutorials/14/setup-openvpn-l2tp-ipsec-sstp-vpn-using-softether/)

L2TP/IPSecでもVPN自体は使えるのですが、後述のような特殊対応をする場合は
OpenVPNがないと接続できないです

## 3 各クライアントにて設定

- L2TP/IPSecで接続する場合

アプリのインストールなどは不要です。
ぐぐるとでてくるので、それにしたがって設定しましょう。

- OpenVPNで接続する場合

OpenVPNの.zipを展開すると
`..._openvpn_remote_access_l3.ovpn`なファイルがあるので、これを使います。

OpenVPN ClientはAndroidやiOSのアプリとして配布されているので、
インストール後、上記ファイルをimportすればokです。

アプリとして配布されているということは、Android TVなどにも導入できてしまいます。
自分のホームプロジェクタがAndroid TV対応だったので導入しました。

<a href="https://www.amazon.co.jp/Anker-Capsule-%E3%83%A2%E3%83%90%E3%82%A4%E3%83%AB%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%82%BF%E3%83%BC%EF%BC%89%E3%80%90200-ANSI%E3%83%AB%E3%83%BC%E3%83%A1%E3%83%B3-%E3%82%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A9%E3%83%BC%E3%82%AB%E3%82%B9%E6%A9%9F%E8%83%BD/dp/B07QBXMY2Z/ref=as_li_ss_il?ie=UTF8&linkCode=li2&tag=techeten02-22&linkId=06eb80104488df090281e985727effae&language=ja_JP" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07QBXMY2Z&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=techeten02-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=techeten02-22&language=ja_JP&l=li2&o=9&a=B07QBXMY2Z" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

Androidベースの、なんとかTV Stickにも導入できますね。
Google Playのアプリを頑張れば導入できるので、
あとちょっと頑張って.ovpnファイルを送信すれば、ナイスなVPNライフが始まります。

## まとめ

まあきっとこういった方法も対策されてしまう気がしますが、
いったんはこれで解決です。
