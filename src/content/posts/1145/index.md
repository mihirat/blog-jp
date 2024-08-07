---
title: 夏の不眠解消！raspberry pi でエアコンの自動制御
tags: ["raspi"]
published: 2017-07-17
category: Tech
draft: false
---


## あらすじ

暑くてめちゃめちゃ目が覚める。

エアコンつけっぱなしだと眠りがなぜか浅く、スッキリしない。

しかし扇風機だと暑さに負けてやはり眠りが浅い。

そこでエアコンの電源予約offを使っても、エアコン切ったあとの温度上昇でまた起きる…

エアコンをつけっぱなしにせずに、一定の温度を保つ方法…自動制御しかない！！

## やりたいこと

一定の温度以上になったらエアコンの電源が入り、一定の温度以下になったらエアコンの電源が切れるようにしたい。

## 作業記録

### 使ったもの

* 家にあったraspberry pi 2
* 家にあった赤外線受光モジュール、抵抗、赤外線送信LED、ブレッドボードなど

### 1.raspberry pi 2をセットアップ

一人暮らし始めてから触ってなかったので、とりあえず

```
sudo apt-get update && sudo apt-get upgrade &&sudo rpi-update
sudo reboot
```

をしたら、久しぶりすぎたせいかraspiに電源が入らなくなった。のでやむを得ずraspbianの最新版をダウンロードします。
すると `sudo apt-get upgrade` ができない！
dpkgに問題があるのだが、[07-05リリースに原因がある](https://www.raspberrypi.org/forums/viewtopic.php?t=187936&p=1186861)っぽいので06-21版をインストールして解決しました。ここまで2時間…
参考：
[Raspberry Pi 2の初期設定(外付けモニタ・USBキーボードなし、OS:Raspbian)](http://qiita.com/kozykana/items/df6aa52cbb8917abc268)

### 2\. 回路をもとに部品を配置

昔買った↓を参考に部品を設置して回路を作ります。
[![](//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=4822224953&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=techeten02-22)](https://www.amazon.co.jp/gp/product/4822224953/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4822224953&linkCode=as2&tag=techeten02-22&linkId=179efe53711f7da473b78ff3d2b606c1)![](//ir-jp.amazon-adsystem.com/e/ir?t=techeten02-22&l=am2&o=9&a=4822224953)


### 3\. lircの設定

```
sudo apt-get install lirc
```

してから、lircの設定をする。
[Raspberry Pi2でリモコンを使って水槽の照明をつける](http://tiger-star.net/aquarium/goldfish/321)が大変詳しいです。
リモコンがちゃんと受信できてるかもチェック。

### 4\. リモコンの学習

lircのirrcordだとリモコンの信号は複雑過ぎて学習できないらしいので、生の信号を書き出してからlircで使える形に変換します。
[Raspberry Pi 2 でエアコン操作（赤外線リモコン編）](http://kaiware007.hatenablog.jp/entry/2015/08/28/020356)がめっちゃ素晴らしいです。

```
sudo /etc/init.d/lirc start
irsend SEND_ONCE aircon on
```

これでピピ！ってなったときの嬉しさ！ここまで4時間

### 5\. 自動化

ほんとは室温取ってきてちゃんと制御したいんですが、最低限on offが自動で動いてくれればいいんで

```
morning=8
while true
do
  irsend SEND_ONCE aircon on
  sleep 3600
  irsend SEND_ONCE aircon off
  sleep 3600
  hour=$(date '+%H')
  if [ $hour -gt $morning ]; then
    break
  fi
done
```

くらい書いてゴール！！！
1時間エアコンつけて、1時間エアコン切ってを繰り返すスクリプトです。

あとは就寝前(morning判定は22時より後に就寝するなら問題ない)に `. autocon.sh` すればok。

これで明日から不眠解消！素人でもお手軽おうちハック。
