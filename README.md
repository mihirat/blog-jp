# Teche Note

Astro で静的生成する個人ブログ。表示は `.astro` コンポーネントと共通 CSS で構成しています。埋め込みの補助スクリプトは、対象のコンテンツがあるページで読み込みます。

## 開発

Node.js 24 LTS と npm を使用します。Node.js の最小バージョンは 22.23.4 です。

```sh
npm ci
npm run dev
npm run build
npm test
npm run preview
```

`npm test` はビルド済みの `dist/` に対し、記事・ページネーション・タグ・カテゴリ・メタデータなどの回帰チェックを行います。先に `npm run build` を実行してください。別の一時ディレクトリで、階層を持つ記事・日本語と中国語のタグ・任意項目の省略・下書きもビルド検証します。

## 記事と表示

- 記事は `src/content/posts/` 以下の Markdown で管理します。サブディレクトリによる階層化と、frontmatter (`title`, `published`, `description`, `image`, `tags`, `category`, `draft`) に対応しています。
- `draft: true` の記事は一覧・記事ページ・タグ・カテゴリ・RSS の生成対象外です。
- 記事 URL は `/posts/<slug>/`、一覧は `/`, `/2/`, … です。
- 記事内の画像・コードブロック・表・埋め込み HTML は Astro の Markdown 処理で描画します。見出しには ID が付与されます。
- Iframely カードを含む記事では公式ローダーを読み込みます。`src/assets/images/` を指す画像のクリック先は、描画後に Astro の生成画像 URL に補正します。
- `image` は記事相対パス、`public/` からの絶対パス、外部 URL に対応します。相対画像の解決には Astro 標準のコレクションスキーマを使います。コンテンツコレクションは `src/content.config.ts` で定義しています。
- `npm run new-post -- <filename>` で記事を作成できます。
- サイト名・著者・リンク・ページサイズ・解析 ID は `src/config.ts`、本文の組版とレイアウトは `src/styles/global.css` で変更します。
- 日本語・中国語用のシステムフォントをフォールバックに含めています。Web フォントのダウンロードはありません。
- ページネーション、タグ・カテゴリ、アーカイブ、About、RSS、サイトマップ、canonical、OGP を提供します。

## Netlify

リポジトリの `netlify.toml` にビルドコマンド `npm run build` と公開ディレクトリ `dist` を定義しています。静的生成なのでサーバーアダプターは不要です。パッケージ管理には npm を使い、`package-lock.json` でバージョンを固定しています。

OGP 画像は Cloudinary の変換 URL を生成して表示します。`PUBLIC_CLOUDINARY_CLOUD_NAME` 未設定時は `src/assets/images/banner.png` を OGP 画像に使い、環境変数なしでもビルドできます。解析には Google Analytics を使います。広告は環境変数 `GATSBY_GOOGLE_ADSENSE_ID` と `GATSBY_GOOGLE_ADSENSE_SLOT_ID` が両方設定された場合のみ出力します。開発サーバーでは広告・解析を出力しません。

## 配信と表示処理

- RSS は記事本文を配信します。`markdown-it` は RSS 用の Markdown 変換、`sanitize-html` は配信 HTML からスクリプト等を除くために使用します。
- バナーは CSS で切り抜き、元画像の余白と右端の線を非表示にしています。

## ライセンス

コードには [Fuwari](https://github.com/saicaca/fuwari) に由来する部分を含み、MIT ライセンスの著作権表示と利用条件を `LICENSE` に記載しています。ブログ記事・画像などのコンテンツの利用条件とは別です。
