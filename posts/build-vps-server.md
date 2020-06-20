---
title: 自分専用のVPSサーバーを構築
tags: ["lifestyle"]
published: true
date: '2020-06-20'
---

## 背景

1. 日本で契約してたサービスが使えなくなった
当初はフリーのOpenVPNとVPN gateを利用していたのですが、それらも対策されて使えなくなりました。

調べるかぎり、大手のVPNサービスは有料無料かかわらず使えなくなったようです。
ただ、それらは多数が単一IPに相乗りしている場合のみ対応されているようです。

2. 無料のVPNサービスは制約が多い

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
記事内だと betaかつ少し古いものを使っているので、最新版を確認しましょう
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
自分のホームプロジェクタがAndroid TV対応だったので、導入しました。

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=techeten02-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B07QBXMY2Z&linkId=26a8870426deff2012ba55fc5b53c3eb"></iframe>


Androidベースの、なんとかTV Stickにも導入できますね。
Google Playのアプリを頑張れば導入できるので、
頑張ってアプリを導入し、あとちょっと頑張って.ovpnファイルを送信すれば、ナイスなVPNライフが始まります。

## まとめ

まあきっとこういった方法も対策されてしまう気がしますが、
いったんはこれで解決です。
