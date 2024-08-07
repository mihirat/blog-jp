---
title: Big Tech 就活メモ
description: 海外大手テック企業狙いで就活した記録
tags: ["career", "life"]
published: 2022-03-31
category: Tech
draft: false
---

大手テック企業でのエンジニアポジションを狙って、４ヶ月くらい就活してました。ヨーロッパ・カナダ・日本のポジションに応募。

ほぼ全滅しましたが、なんとか希望のポジションでオファーを獲得でき、APACチームで働くことになりました！（しばらく生き残れたら入社ブログを書くかもしれません）

どなたかの役に立つかと思い備忘録をまとめておきます。あくまで私見なので内容の正確性はご容赦ください。

### 海外大企業就活の雰囲気

海外の大きい企業の面接、またそれを参考にしてプロセスを作っている企業の面接は似たような形式に則っているので、一度その面接対策をすれば他社での面接にも大部分を流用できます。

しかしこの面接形式では、実務で使うスキル以外も見られます。実務とオーバーラップする部分ももちろんありますが、実務関連が５割、それを30mや1hのインタビューに凝集してアピールするスキルが残りの５割、といったイメージです（体感値）。後者の面接用スキルの準備に時間がかかります。

準備においては、過去の面接事例の情報収集が大事です。インターネットにはつよつよ人の就活記がよく公開されてますが、自分とスペックが違いすぎると参考にならないので、自分のレベルに合った準備のやり方を考えていく必要があります。

つよつよ人だったらここまで準備せずにオファーもらえるかもしれませんが、凡骨には凡骨の戦い方があります。以下説明していきます。

### 面接の流れ

1. 応募、履歴書のスクリーニング
2. 1st call（ポジションについての説明や、そもそもビザや居住地など応募資格があるか見られる）
3. コーディング試験（システムで実施することがほとんどだが、面接官とペアプロの場合もある。複数回の場合もある。）
4. 技術面接・システムデザイン面接・行動面接（順不同、いくつかの要素を１回のセッションで同時に見られることも）
5. オファー

面接で評価される項目と、それをみられるタイミングはこんな感じだと思います。

- 過去の経験と応募ポジションのマッチング
  - スクリーニング時。履歴書に書いてある内容がポジションにあっているかを見られる。
  - 技術面談時。過去のプロジェクトでの課題解決エピソードなどから見られる。
- データ構造とアルゴリズムのコーディング力
  - コーディング試験時。LeetCodeやCoderRank、Codilityなどのプラットフォームで実施されることがほとんどだが、ペアプロの場合も。
- CS力（UNIXやインターネットの知識、基本的なOOPなどを雑にまとめた何か）
  - 技術面談時。ネットワークやサーバーの仕組みを理解して説明ができるか、InheritanceとCompositionの違いを理解しているか、など見られる。
- システムデザイン力
  - システムデザイン面談時。例えばTwitterを作るとしたらどうするか？といったばっくりとした質問から始まる一連のお題に対して、それらを解決する（解決できなくとも、少なくとも矛盾のない）システム構成図を書く。
- パーソナリティとカルチャーのマッチング
  - 行動面接時。受け答えがロジカルか、過去のプロジェクトで建設的な判断に基づいて行動してきたか、などが見られる。チームメンバーと上手くやれそうかなども見られる。

もちろん全てが英語。こちらのブログで書かれているようなことはもちろん、テクニカルタームは一通り抑えておくべき。

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://qiita.com/jabba/items/514179b02429b519e364" data-iframely-url="//iframely.net/4hjtpxf?card=small"></a></div></div>
<br/>

Seniorなど上位ポジションだと、メンタリングやプロジェクトリードの経験なども問われる。逆算してその辺の経験を積んでいくべきなんだろうなぁ。

余談だが、SREのポジションの面接では、プロダクション環境でのトラブルシューティングの経験やSLO策定に関連したエピソードなどに加え、UNIXコマンドやプロセス、ネットワークあたりを深掘りされた。Syn flood attackなどセキュリティ系も。全般的に浅い理解のためうまく説明できず、無事落選。
TerraformやKubernetesなどのハンズオン経験には多少覚えがあったが、求められるスキルと完全にズレていた。

### やったこと

LinkedInのステータス変更

- リクルータの目に止まるように、仕事探し中のステータスにする。希望する国や働き方などちゃんと設定。
- 職歴をそれっぽく英語で書き直す。応募用CVを綺麗に作る。
- 来たスカウトメッセージに返事する。しばらくするとメッセージが増える、リクルータ側の検索で上位表示になる？（返信数がアクティブ率スコアの計算に加味されてそう）

- その他の求人サイト登録。Hired, 4scotty, Honeypot, AngelList, HackerX, Turingなど。とりわけHoneypotは具体的なスカウトが多く、非常にいいサービスだった。
- 日本だったらBizreach, Wantedly, Offers, 各種エージェントなど。

面接対策

- そもそも募集要項と自分のスキルや職歴が合致してないと書類通過しないので、合ったポジションを探す。なかったら、行きたいポジションにつながるようなスキルと職歴を積んでおくか、大学院入ったりする？
- アルゴリズムやCS力はすぐに身につかないので勉強（後述）。
- 基本的な面接での受け答えの準備。頻出質問リストなどはすぐ検索でヒットするので、『〜な時、あなたはどう対応しますか？過去の経験を踏まえて教えてください』系は100個くらい考えておく。STARメソッドはとても学びになる。

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://jp.indeed.com/career-advice/interviewing/how-to-use-the-star-interview-response-technique" data-iframely-url="//iframely.net/Vb5vhse"></a></div></div>
<br/>

<iframe sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin" style="width:480px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=techeten02-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B07DYYFZYL&linkId=3c7b611d7cc60de8398db5bc6b110ac5"></iframe>
<br/>

- 多くの企業では何度も同じポジションに応募できるが、一度落選してから再受験までの期間は半年〜１年と長めに設定されている。一度失敗するとしばらく受けられないので、応募までにしっかり準備しておく。
- 企業のホームページやポジションの募集要項はもちろん読んで質問リストを作っておく。技術スタック、開発スタイルやチーム構成、直近のプロジェクトなどなど。
- 面接官の名前がわかったらLinkedInで軽く職歴など見る。元ソフトウェアエンジニアのリクルータなら技術の話がしやすい、話せる自然言語など共通の話題があったらアイスブレークしやすい、など事前準備ができる。個人的には、顔を事前に知っておくと落ち着いた。
- 大きな企業の場合、GlassdoorやReddit、個人ブログ、Youtubeなどで選考過程について情報が出回っているので、情報収集して対策を立てる。初期時点でここに時間を割いておかないと、書類選考は通ったが次の面接の準備が間に合わない！なんてことになる（なった。落ちた）

アルゴリズム力とCS力の勉強

とても苦手、LeetCodeのEasyも怪しいレベルからスタートしたのでかなり時間がかかった。

- まずはけんちょん本を読んで写経。自分のレベルが低すぎて説明が飛躍しているように感じた部分も多いが、とりあえず写経。

<iframe sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin" style="width:480px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=techeten02-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B08PV83L3N&linkId=48fd5de0a582347d78984c774ab08169"></iframe>

- 写経が済んだら、leetcodeを解き続ける。必ず回答のコードを読むと学びが多い。有料課金したくない場合は、問題名でググると誰かしら動画やコードをアップロードしているので探す。回答は玉石混交なので注意。下記リポジトリにはかなりお世話になった。

[https://github.com/haoel/leetcode](https://github.com/haoel/leetcode)

- leetcodeを上から解くのでなく、体系的に学べるように問題を探す。100問くらい解いたらそこそこ書けるようになった気がする。30分以内にLeetCodeのMediumが解けるくらいが目安。
有名な問題セットは下記

[New Year Gift - Curated List of Top 75 LeetCode Questions to Save Your Time](https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-75-LeetCode-Questions-to-Save-Your-Time-OaM1orEU)

[Study Plan](https://leetcode.com/study-plan/)

- コーディングテストのプラットフォームごとに、出題傾向や期待されるI/Oが異なることも。LeetCode以外にも慣れておくとよい。
- 自分のIDEが使える面接もあるので、補完など設定してしっかりローカル開発環境を作っておく。
- ペアプロが面接に含まれる場合は、何回か練習すると落ち着く。ペアプロ面接動画もYoutubeにあるので、まずは観て雰囲気を掴む。オンラインで無料のペアプロ練習サービスとしてPrampなどがあるが、ちょっとヒヨって使わなかった。以下のようなペアプロ動画まとめもあるので、このへんを見ると雰囲気が掴める。

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://www.youtube.com/channel/UCNc-Wa_ZNBAGzFkYbAHw9eg" data-iframely-url="//iframely.net/fwbA7wm"></a></div></div>

<br/>

システムデザイン

- 動画や教材が多い。出題傾向もある程度決まってる感じがあるので、Twitterとか有名どころのアーキテクチャなどは抑えておくと良さそう。別に決まった答えがあるわけではないし100%その通りの回答ができるはずもないので、論理的に矛盾のない構成を目指すくらいが現実的か？
- 自分の場合は実務でよくやってたので、あまり勉強せずに行けた。
- Youtube などで検索するといろんな人が動画出してるので、いくつか見ておくと学びになる。慣れてきたら、お題になるサービス名を見て実際に自分でシステムデザインして、後で動画の内容と照らし合わせてみるとか。

<iframe width="560" height="315" src="https://www.youtube.com/embed/KmAyPUv9gOY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<br/>

## 就活の結果

応募数: 約34（欧10,加15,日9)

書類通過: （欧1,加1,日8、選考辞退とサイレントお祈り含む)

１次通過: 3 (日3)

２次通過: 1

最終通過: 1

ヨーロッパ・カナダはほぼ書類すら通らず壊滅。ビザサポートできないからお断りのケースもありましたが、いきなり大企業に応募する厳しさを思い知りました。しばらく応募継続したものの、見込みがなさすぎて日本での就活にシフト。

なお、ドイツやオランダのスタートアップからはそれなりに声がかかったので（~シリーズB付近）、スタートアップならオファーまで至ったかもしれません。ただ、コロナ下で家族ありでの転職だったのでリスクが大きいと判断し、いずれも選考を辞退しました。

- 提案されたポジションがドイツで 65k€ /yr とかだったので、 １馬力では家賃と税金的に生活が厳しそう（外国人をするのは金がかかる）
- 海外移住なんて平時でも大変なのに、有事に役所手続き・引っ越しほか、生活基盤作りをやり遂げる自信がなかった。スタートアップでは生活支援が弱い。
- 渡航時の世界情勢が予測できない。結果論にすぎないが、今の情勢を見るにヨーロッパは止めておいて正解だったと思う。

ちょっと弱腰だったかもしれないですが、長期で海外生活するなら高収入＆バックアップが強い環境がベターというのが、過去２回の１年以上の海外暮らし経験からの学びです。

なお、ヨーロッパ・カナダで全滅した振り返りとしては、仮説レベルですが

- CVのクオリティが低い。
- 単純に経験・スキル不足。話を聞いてもらえるだけの経歴を積んでない。
- 大企業の求めるスキルセットになってない。いろいろ薄く広くできるというスキルセットは、スタートアップや新規事業チームには刺さるが、専門性が足りない。
- 移住コストや各種手続きの点で、外国の人間は忌避されがち。同一タイムゾーンでのリモート採用枠が多かった印象。

あたりでしょうか。今後のエンジニア人生に生かします。

一方、スカウトで声をかけてもらえた国自体は、２年前に就活した時よりだいぶ増えました。

日本、オランダ、マレーシア、ドイツ、シンガポール、カナダ、イギリス、タイ、ベトナム、UAE、スウェーデン、エストニア、インド、スイス、スペイン、オーストラリア、フィリピン、アメリカ

あたりが今回声かけてもらった国です。進捗が見られて普通に嬉しかったです、働き口が多いのはいいこと。

### 今回の転職活動での学びや振り返り

- 短期では終わらないので長期戦を覚悟した方がよい。書類選考結果通知まで１ヶ月かかることもザラにある。長期戦に備えて、体調・メンタル管理など意識的に取り組んでおく。めちゃくちゃ疲れた。
- 同時平行で受けられるインタビューは４つくらいが限界。特に面接慣れしてない初期は２つくらいに制限し、準備や問答対策に時間とった方が後々役に立つ。
- しばらく実務から離れると、面接力以外のスキルが痩せ細っていくし、当時のエピソードの記憶も薄れていく。就活のみにフォーカスできるのは3ヶ月くらいが限度？金銭的・社会的な不安なども含めて。
- 全体的にCS力のなさを痛感した。海外リモート大学院やら社会人博士やらを真剣に検討する必要がありそう。何かオススメあれば教えてほしい。
- 近傍タイムゾーンでのリモート採用が一般的になっている様子。特にヨーロッパで、オフィスのある国から+-3時間の時差内の居住者なら応募可、といった採用枠が多く見られた。ビザサポートありで海外現地就職を狙うなら、フルリモートNGの企業や、APACのタイムゾーン内に拠点を持たない企業を探す方がいいのかもしれない。
- オファー時の交渉も大事らしい。相場感を掴んでおくために、levels.fyi, opensalaryなどを事前に見ておくと良さそう。

### 今後の見通し

- 日本ではエンジニアの絶対数が少ない上に雇用流動性の低さもあり、多国籍開発チームの話をちらほら聞くようになった。多国籍チームでの就労経験やマネジメント経験は、今後高く評価されていきそうな予感。

[日本を席捲する採用バブルと、海外動向を踏まえた際の危うさ｜久松剛／IT百物語の蒐集家｜note](https://note.com/makaibito/n/n09dde061613f)

[日本人エンジニアが、日本でも海外エンジニアと競争せざるを得ない時代｜えらぶ　ゆかり（@yukari_erb）｜note](https://note.com/yukari_erb/n/n0a6abd97d01e)

“**日本語しかできないならば、日本人特有のバリューを発揮せよ。さもなくばグローバルのIT人材に匹敵する英語とコンピュータ・サイエンスのスキルを持て。**
そういう時代が、本当にすぐそこまでやってきていると感じるのです。”

特にここには共感、ベトナムで働いた体感にも近い。英語と母国語が話せるミドルレベルのエンジニアくらいなら、マジで世の中いっぱいいる。

- フルリモートのICでこの先食っていくなら、近傍タイムゾーン内での自身の市場価値を考えて行く必要がある。日本居住なら、シンガポール・ベトナム・韓国・中国・台湾あたりが同じ市場になりそう。つよつよ人はどこにでもいる。

- 他地域・他国に居住地を移せるというオプションを常に持っておきたい。日本で10年後に幸せに働けるのか、いろいろ思うところがある。

とかなんとか言ってみましたが、こんな自己中打算的な考えをかなぐり捨ててチャレンジできる準備はしておきたいです。

## 以上、就活チャレンジの記録でした

何か質問あれば `@techeten` までどうぞ。
もしくは、試験的に[質問箱サービス](https://peing.net/ja/techeten) を始めてみたので、こちらでも対応できるように頑張ります。

最後に欲しいものリストを掲載したいところでしたが、もしそのようなお気持ちがあればこちらへどうぞ。

[ウクライナ緊急：避難を強いられる家族に人道支援が急務です｜国連UNHCR協会](https://www.japanforunhcr.org/campaign/ukraine)

その他、参考になった記事一覧です。まだまだあるんですが引用が大変なのでこのへんで。

- [ドイツ・ベルリンに移住してエンジニアの仕事を見つけるまで](https://ctokoro.hateblo.jp/entry/2018/12/25/%E3%83%89%E3%82%A4%E3%83%84%E3%83%BB%E3%83%99%E3%83%AB%E3%83%AA%E3%83%B3%E3%81%AB%E7%A7%BB%E4%BD%8F%E3%81%97%E3%81%A6%E3%82%A8%E3%83%B3%E3%82%B8%E3%83%8B%E3%82%A2%E3%81%AE%E4%BB%95%E4%BA%8B%E3%82%92)

<iframe class="note-embed" src="https://note.com/embed/notes/n1f329de5ee50" style="border: 0; display: block; max-width: 99%; width: 494px; padding: 0px; margin: 10px 0px; position: static; visibility: visible;" height="400"></iframe><script async src="https://note.com/scripts/embed.js" charset="utf-8"></script>
<iframe class="note-embed" src="https://note.com/embed/notes/n67b2b6a45960" style="border: 0; display: block; max-width: 99%; width: 494px; padding: 0px; margin: 10px 0px; position: static; visibility: visible;" height="400"></iframe><script async src="https://note.com/scripts/embed.js" charset="utf-8"></script>
<iframe width="560" height="315" src="https://www.youtube.com/embed/j6YnOvhEn5s" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
