---
title: ポチポチ手動で作成したAWSの既存リソースをTerraformに取り込むスクリプト with terraforming
tags: ["aws", "terraform" ]
published: 2018-08-26
category: Tech
draft: false
---


## TL; DR

* 手動で作ってしまったAWSのリソースをTerraformに取り込むスクリプトを書きました
* とはいえterraformingの対応範囲が広くないので、妥協は必要

## 背景

「まずは最低限の設定だけ手動で作ってしまおう！」とAWSを使い始めて、
途中から管理が辛くなってきたのでTerraform化したい！と思うものの、
すでに作ってしまったリソースをどうコード化するか問題、ありますよね（やりました

このリソースだけはTerraform化されてないんですよーとなると、
作業の引き継ぎなどもなかなか難しく、負債がどんどん積まれていきます。

Terraformに既存リソースを記述する方法は

##### 方法1\. 既存のリソースのv2をTerraformで新規に作成し、タイミングを見て移行していく

* Pros: Terraform側はめっちゃきれいに書ける
* Cons: ダウンタイムなしでやろうと思うと長期化必死、移行作業もなかなかハード

##### 方法2\. 既存のリソースのコード化を諦め、data resourceなどでTerraform側に取り込んでいく

* Pros: 1と3の折衷案
* Cons: コード化はできてないので、既存リソースの状態は管理できない

##### 方法3\. 既存リソースをそのままTerraformに取り込む

* Pros: 理想的
* Cons: Terraformのimportが貧弱でつらい（後述）

なのかなと思います。以下、3を頑張っていきます。

### terraform importを使う

公式でも3を行うための `terraform import` という機能がありますが、

1. `.tf` にリソース名だけ付与した、中身が空のリソースを作成
2. `terraform import` する ( `.tfstate` のみ更新される)
3. 更新された `.tfstate` にマッチするように.tfファイルの中身を手書きで埋める

という、なかなかに辛い作業です。
こちらが詳しいです [Terraformのimportの使い方と注意ポイント](https://blog.mosuke.tech/entry/2018/06/20/terraform_import/)

### terraformingを使う

もっとスマートにできないか、と今回参考にしたのはこちら。
[Forkwell のインフラをコード化するためにやったこと](http://tech.grooves.com/entry/2018/01/22/091959)

terraformingとは、個人で開発されている、Ruby製のコマンドラインツールです。
インストールなどはリポジトリを御覧ください。
[terraforming](https://github.com/dtan4/terraforming)

こちらは本家と違い、既存リソースを自動的に.tfファイルへ書き出してくれて、さらにそれを.tfstateにマージする機能もあります。
ステキです。これを使って、環境を破壊しないように注意しながら自動的に既存リソースをマージしていきます。

作業の順番としては、

1. リモートにある `.tfstate` をローカルにコピーし、さらにバックアップをとる
2. 既存リソースを `.tf` に書き出す
3. `.tf` に書き出した中身をローカルの `.tfstate` にマージする
4. ローカルにある `.tf` を使って、ローカルの `.tfstate` に対して `terraform plan` を行い、リソースの追加や削除といった変更が出ないことを確認する ( `.tf` の状態と `.tfstate` に差分がないことを確認する)
5. 問題なければ、ローカルにコピーした `.tfstate` をリモートに上書き

となります。これをシェルで雑に書くとこんな処理になります。

```shell
#!/usr/bin/env bash
# terraforming_merge.sh

set -o nounset
set -o errexit

terraforming_resource_key=$1
output_filename=$2.tf

# リモートから .tfstateをとってくる
aws s3 cp s3://my-terraform-state/aws-terraform.tfstate ./bin/

# バックアップとっておく
cp ./bin/aws-terraform.tfstate ./bin/aws-terraform.tfstate.bak

# .tf に書き出し
terraforming $terraforming_resource_key > $output_filename

# tfstateにマージ
terraforming $terraforming_resource_key --tfstate --merge ./bin/aws-terraform.tfstate --overwrite

# 差分がでてないか確認。差分出たときのコメントをgrepしてるだけなので、仕様変更に要注意
./bin/terraform_plan.sh > result.log
is_changed=$(echo $(cat result.log | grep 'to add'))

if [ -n "$is_changed" ]; then
  # 差分が出てたら、result.logを見て修正する
  echo "diff found. Check your changes."
else
  # 差分がなければimport成功
  echo "ALL GREEN. .bak is deleted and overwrite merged tfstate to s3."
  rm ./bin/aws-terraform.tfstate.bak
  rm result.log
  # upload tfstate
  aws s3 cp ./bin/aws-terraform.tfstate s3://my-terraform-state/aws-terraform.tfstate
  rm ./bin/aws-terraform.tfstate
fi
```

呼び出すときは
`$ terraforming_merge.sh vpc my-vpc`
みたいに使います。
このスクリプトで、リソースの種別ごとにまとめてimportできるようになりました。
(もしこれを使うようでしたら、一応一行ずつ実行して問題ないか確認してくださいね！)

完！と行きたいのですが、一つ問題が。
terraformingでimportできるリソースの種類が非常に限られたものだけになっています。
（本家の開発が早すぎるのでやむを得ないと思いますが。）

とはいえ、
VPC、Route53、Security Group、RDS、ELBなどの
コアなものについてはカバーされていますので、ある程度はこれでimportできる気がします。

これでimportできないものについては、
最初に挙げた1や2の方法で少しずつTerraform化していくことになるのかなと。
