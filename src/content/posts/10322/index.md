---
title: Ask the Expertブースで聞いてみたIstio @ Google Next ’18 in Tokyo
tags: ["istio", "kubernetes", "gcp"]
published: 2018-09-24
category: Tech
draft: false
---


こんばんは。
今回は、[前回のIstio記事](http://techeten.xyz/10305)の構成について思っていた疑問点を、GoogleNextにせっかく参加したので聞いてみましたという記事です。

### 前回構成の疑問点

前回の構成図は下記のようなものでした。

[![](../../../../src/assets/images/istio-blog-1.png)](../../../../src/assets/images/istio-blog-1.png)

これにて一見落着っぽいのですが、
ふと「あれ、これマルチクラスタとかできないのでは？」

Regional IPをそのまま　istio-ingressgatewayのserviceに紐づけてしまったので、
Istioを使うためにはマルチクラスタ構成ができないのか…？GCLB使いたいときは…？

これが疑問点でした。

### The Expert Response

Ask the Expertブースにはかの有名なイアン氏がいたので（日本語ペラペラ）、聞いてみました。
Istioはあまり把握していないとのことだったのですが、
「istio-ingressgatewayもserviceなのだから、LoadBalancerIPでexposeするのでなく、NodePortで公開してしまって、GCLBからはGKEのinstance groupに対してトラフィックを流せばいいのでは？」とのこと。
ズバリ下記構成です(podは省略)。

[![](../../../../src/assets/images/stio-blog-2-580x354.png)](../../../../src/assets/images/stio-blog-2.png)

た、たしかに。
Istioの公式にも、istio-ingressgatewayをそのまま公開すべし、といった話はなく、NodePort使う場合には？みたいな説明もありました。
<https://istio.io/docs/tasks/traffic-management/ingress/#determining-the-ingress-ip-and-ports-when-using-a-node-port>

まだ試してませんが、こうすればGlobal IPも使えるし、マルチクラスタもできそうです。
どのみち既存構成からダウンタイムなしでIstio化することはなかなか難しそうではありますが。

ただ、GKEをそこそこ長く運用してきてわかったことの一つに、障害頻度としてはGCLB　> GKEという問題があります。
そして世界中からの分散トラフィックがくる状況下になければ、マルチクラスタする旨みもどうなんだろう感。
悩ましいですね！以上です。
