---
title: TerraformでHasuraをHerokuにデプロイ
description: 全て無料範囲で、HasuraのDockerをHerokuにデプロイしていきます
tags: ["terraform", "hasura", "heroku", "docker"]
published: true
date: '2021-09-26'
---

モチベが脆弱なので、趣味開発のアウトプットをかましていきます

## 解決したい問題

「Herokuになんと、ワンクリックでデプロイ出来ちゃいます！！」という売り文句。

いったい何がどうデプロイされてて、ワンクリックした結果何が起きてるか怖いこと、ありませんか？

ありますね。Terraformでリライトしましょう。

完成品の.tfは最後にまとめて載せます

### CI/CDはTerraform Cloud

１人で使う分には無料、かつTerraformの実行環境やtfstate保存場所を考えずに済むので採用してみました。

[Automate Terraform with GitHub Actions](https://learn.hashicorp.com/tutorials/terraform/github-actions)
の記事をそのままなぞると、

1. Terraformのリポジトリに変更をpushすると`terraform plan`し、plan結果をPRにコメントしてくれる
2. マージしたら`apply`が走る

までできます。

[![workflow](https://learn.hashicorp.com/img/terraform/automation/tfc-gh-actions-workflow.png)](https://learn.hashicorp.com/img/terraform/automation/tfc-gh-actions-workflow.png)

Terraform内部で使うSecretはTerraform Cloud上で登録、

Terraform CloudのAPI tokenはリポジトリのSecretに登録することになります。


### Herokuまわり

Herokuアカウントを作成し、[API tokenを払い出し](https://devcenter.heroku.com/ja/articles/using-terraform-with-heroku#obtaining-an-authorization-token)てTerraform Cloudに登録しましょう。

なお、今回はHerokuにDockerをデプロイすることになるので、

`resource "heroku_app"` の中で `stack = "container"` 

を定義してやる必要があります。[ref](https://registry.terraform.io/providers/heroku/heroku/latest/docs/resources/build#building-with-docker)

また、デプロイするリソースの置き場としてHasuraが管理しているGitHubのurlを指定していますが、

tagを打たないとデプロイできない（？）っぽいがオリジナルにtagがない & オリジナルがちょっとstaleなので、

forkして自分のリポジトリにタグを打って管理することにしました。

一部抜粋

```terraform
resource "heroku_app" "foobar" {
    name   = "foobar"
    region = "us"
    // for docker
    stack  = "container"
}

resource "heroku_build" "foobar" {
  app        = heroku_app.foobar.id

  source {
    // fork of https://github.com/hasura/graphql-engine-heroku
    url     = "https://github.com/mihirat/graphql-engine-heroku/archive/v0.1.0.tar.gz"
    version = "v0.1.0"
  }
}
```

DBはaddonとして追加できるので、postgresを追加します。

無料目的なので`hobby-dev`を忘れずに。

```terraform
# Create a database, and configure the app to use it
resource "heroku_addon" "db" {
  app  = heroku_app.foobar.name
  plan = "heroku-postgresql:hobby-dev"
}
```

また、Hasura側でGraphQLのadmin secretなどが必要になるので、
[環境変数の設定](https://registry.terraform.io/providers/heroku/heroku/latest/docs/resources/app_config_association)も同時に行います。

変数の中身も同じくTerraform Cloudで定義。

```
resource "heroku_app_config_association" "foobar" {
  app_id = heroku_app.foobar.id

  sensitive_vars = {
    HASURA_GRAPHQL_ADMIN_SECRET = var.hasura_admin_secret
    HASURA_GRAPHQL_JWT_SECRET   = var.hasura_jwt_secret
  }
}
```

TerraformでBEを管理するのはどうなんだ問題はあるんですが、

Hasuraの更新を頻繁に行うことはないと判断し、いったんTerraformに寄せています。1人月だし。

### Hasura周り

Hasuraでは、GUIでぽちぽちDBスキーマを編集した操作をmigrationファイルに保存し、
それを別環境でCLIにて再現することが可能です。[ref](https://zenn.dev/takaonarikawa/articles/9a1ecfadd7df3a)

devで試行錯誤したスキーマをprodに反映するために、リポジトリにmigration結果を残しておきます。

１人開発じゃなかったら、localで試行錯誤したmigrationをdev / prodに反映していくべきでしょうか。

prodにapplyするのはCIで設定して、tagうちで発火するなどにすると良さそう。

一人なのでそこまでしてないですが。

ちなみに今回リポジトリを増やすのが面倒だったので、Terraform管理リポジトリに `hasura/`　を生やしてます。

HasuraのリソースをいじっただけなのにTerraform用のGitHub Actionsが発火するのが嫌だったので、

[GitHub Action で特定のディレクトリ配下に変更があったときのみワークフローを実行する](https://blog.35d.jp/2020-09-29-github-actions-path)　を参考にして設定をいじりました。



## 最終成果物

こんな感じ。

```terraform
locals {
  app_name = "sample-api-dev"
}

resource "heroku_app" "sample" {
  name   = local.app_name
  region = "us"
  stack  = "container"
}

resource "heroku_addon" "sample_db" {
  app  = heroku_app.sample.name
  plan = "heroku-postgresql:hobby-dev"
}

resource "heroku_build" "sample" {
  app = heroku_app.sample.name

  source {
    url     = "https://github.com/mihirat/graphql-engine-heroku/archive/v0.1.0.tar.gz"
    version = "0.1.0"
  }
}

resource "heroku_app_config_association" "sample" {
  app_id = heroku_app.sample.id

  sensitive_vars = {
    HASURA_GRAPHQL_ADMIN_SECRET = var.hasura_admin_secret
    HASURA_GRAPHQL_JWT_SECRET   = var.hasura_jwt_secret
  }
}

resource "heroku_formation" "sample" {
  app        = heroku_app.sample.name
  type       = "web"
  quantity   = 1
  size       = "free"
  depends_on = [heroku_build.sample]
}

```

## まとめ

- 無料範囲でサーバーだけでなくCI/CDまで全部できるの素晴らしいですね！
- Hasuraは面白い。開発が早くてアプデ追従大変そう
