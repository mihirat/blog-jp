---
title: GatsbyからAstroへ移行した話
description: なんか流行ってるらしいので
tags: ["astro"]
published: 2024-09-07
category: Tech
draft: false
---

移行しました！

# なんで

### そもそも選んだテンプレートがイマイチだった

日本語対応が想定されてないデザインで、フォントが読みにくかったです。
あとURLを貼るとレイアウトが崩れるバグがあったんですが、ぱぱっと修正できるスキルがありませんでした。。

### Gatsbyしんどい問題

URL構造をいじるなど、ちょっと面倒なことをやろうとするとGraphQLに手を入れる必要があるのがGatsbyの手間なところだなーと感じました。

使い方が悪いんだと思いつつ、もっとシンプルで維持しやすそうな雰囲気のフレームワークに移りたい気持ちがありました。おそらくカスタマイズしないし。
（Wordpressやめたときと同じ理由なので、きっとまた繰り返す）

### Gatsbyのアップデートが大変らしい問題

しばらく放置してたので、一時はライブラリ一通りアップデートしようとしてたのですが、
v2系からv5系までの移行となるとmigrationが大変風なアナウンスがあって、着手するモチベがなくなりました。

### ということで

移行しました。

# 何に移すのか

雑に調べた感じ、Gatsbyから移行したブログは概ね Go製のHugo or ReactのAstro に分かれていました。
Goはしばらく触ってなかったので、多分技術的な問題につまづきやすく、すぐ移行先を探すことになりそうだったのでやめました。

Astroはざっとみた感じ、Jinjaテンプレートのような、HTMLからの距離が近い雰囲気を感じたので決定。

移行したブログで参考にさせていただいたのは下記です。

https://blog.riywo.com/2023/01/migrated-blog-to-astro/
https://ryota2357.com/blog/2023/migrate-to-astro-from-gatsby/
https://www.alpha.co.jp/blog/202401_01/
https://www.ryokatsu.dev/blog/2022/0824/


# やったこと

## 1. いい感じのテンプレ探し

前回は雑にテンプレート選んで失敗したので、今回はちゃんと探しました。

- 日本語や中国語などマルチバイト文字を意識していること。読みやすいフォントとか意識されてそう。
- コミットが直近であり、コミット数が多いこと。品質が良さそう。
- 無料。そりゃね。



## 2. 

## 3. config.jsなどの修正

自分が選んだテンプレートにはLinkedInなどのアイコンが入ってたので、
それらをいい感じに修正。
<https://greendiver234.com/gatsby-blog-getting-started-3/>

## 4. NetlifyでのCI/CD設定とホスティング

CI/CDが最初からついてきて、
ホスティングは爆速、
SSLもok。
次何か作るときはNetlifyを使う気がします。Netlifyはすごい。

<https://greendiver234.com/gatsby-blog-getting-started-4/>

## 他に参考にしたブログ

- [WordpressブログをGatsby+Netlifyでリプレースした話。](https://ver-1-0.net/2019/01/10/blog-renewal-by-gatsby)

- [WordPressやめます Gatsbyに移行しました](https://tech-blog.s-yoshiki.com/entry/192)

- [7年間使ってきたWordPressを捨ててContentful+Gatsby+Netlifyにしたら爆速になったし経緯とか教訓とか語る](https://qiita.com/kfurumiya/items/d0f4a327318b88bd6199)

- [ブログをWordpressからGatsbyに移行したので、その手順とハマったポイントを解説する](https://qiita.com/akashixi/items/9653d0a6522117618e0f)
