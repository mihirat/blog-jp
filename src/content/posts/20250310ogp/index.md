---
title: (AI達に助けてもらって) OGP画像に対応しました
description: PerplexityとCursorはすごいね
tags: ["astro", "ai"]
published: 2025-03-10
category: Tech
draft: false
---

ブログをシェアしたときにOGP画像を出したい！

OGP対応するまで通常の記事は書かないッ！と決めてから１５ヶ月、記事が全くリリースできなくなりました。

つきましては、つまづいてから放置していたOGP対応をしたよ、という記事です。

前回試してみたときは半日溶けて成功しなかったのに、AIに頼んだら１hで終わった！

## うまくいかなかった方法；satoriを使う

先人達の真似をしてごにょごにょしてみたのですが、うまく導入できませんでした。
ちゃんと調べてないけど、よく考えたらSSRじゃないと動かないんじゃないかこれ？

[Astroでsatoriを使ったOG画像の自動生成を実装する](https://blog.70-10.net/posts/satori-og-image/)

[Astro で satori を使う際、ローカル画像を読み込むのに苦労した](https://qiita.com/kskwtnk/items/18df868e80969250ac00)


## うまくいった方法：Cloudinaryを使う

失敗したやり方に固執するのは良くないので、広くやり方を探してみた。
Cloudinaryというサービスが良さそう。

[Astroで新しいブログサイトを作った](https://blog.yajihum.dev/blog/posts/tech/20230225_create_new_blog)

### 導入の流れ

1. Clodinaryに登録する

Signup for free的なボタンからGithubですぐログイン可能。無料枠の範囲内であればクレカ情報なども不要っぽい。

2. OGP画像の背景画像をアップロードする

Media Explorer > Uploadで画像をアップロード（画像は[catnoseさんの記事](https://catnose.me/notes/cloudinary-dynamic-ogp-image)から拝借）

すると固有ID(Public ID)が付与されるのでそれをコピー。

3. astro-cloudinaryをインストール

`pnpm install astro-cloudinary`

使い方がわからないのでPerplexityに聞く。

> OGP画像の対応に、Cloudinaryを使うことにしました。
> https://catnose.me/notes/cloudinary-dynamic-ogp-image
>に書いてある内容を参考に、astro-cloudinaryというパッケージを使っていい感じに実装する方法を調べてください

そのままコピペして導入してみる。

オプションパラメータでエラーが出てくるので、Cursorに泣きつく。

> このパラメータ使えないみたいなんで、代替案を提案して直してください

直らないのでやむなく[公式ドキュメント](https://astro.cloudinary.dev/getcldimageurl/configuration)を読む。

astro-cloudinary経由だと指定できないパラメータみたいなので、無理矢理挿入してみる。

`url.replace(',co_rgb:333333', ',co_rgb:333333,c_fit,w_800')`

直ったっぽい。

もうAIが働いてくれたら良さそうだなーと思う日々です。その一方で、自分がレビューできる範囲の内容じゃないとかなり怪しい実装になりそうだなとは思いました（一応レビューは軽くしました）。
最近だとライブラリにマルウェア仕込むのがトレンドですし、コピペ実装はとても危ないですね。

とりあえずこれでブログ記事執筆行動がアンロックされたので、これからはちゃんといろいろ書いていきたい所存！
