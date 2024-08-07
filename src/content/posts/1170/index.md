---
title: 【AWS】 Lambdaを使ってS3の既存画像を全部リサイズする
tags: ["aws", "lambda"]
published: 2017-09-11
category: Tech
draft: false
---

今更感漂う記事ですが、これっていう記事が見つかんなかったので一応まとめておきます。

## 1\. Lambdaの準備

Lambdaでの画像リサイズなんて膨大な記事が出て来るわけですが、なんかAWSのサンプルコードベースのやつだと一部の画像で変換処理がうまくかからなかったです。
原因はどうもnodeのGraphicsMagickだとダメで、ImageMagickだとうまくいくタイプの画像があるらしいこと。
node初心者なのでコード切り貼りして、下記のような形で完成。
縦横長い方が一辺1000pix以上だったら、1000pixになるように縮小するというもの。
ifの辺りでゴリゴリしてるのは多分書き方がアレですが…

参考サイト：
[AWS Lambdaを使ってS3にアップロードされた画像をリサイズする](http://qiita.com/awm-kaeruko/items/00d92cf2484405fb5579)
[Amazon S3 にある大量の既存画像を AWS Lambda で一気に変換する](http://qiita.com/tmtysk/items/d15b69c54c14b9304f55)

```js
var im = require('imagemagick');
var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: true });
var aws = require('aws-sdk');
var s3 = new aws.S3({ apiVersion: '2006-03-01' });

//最後に呼ばれる
var postProcessResource = function(resource, fn) {
    var ret = null;
    if (resource) {
        if (fn) {
            ret = fn(resource);
        }
        try {
            fs.unlinkSync(resource);
        } catch (err) {
            // Ignore
        }
    }
    return ret;
};

var resize = function(event, context) {
    //Lambdaファンクションの動作環境での作業場所
    var resizedFile = "/tmp/resized." + (event.outputExtension || 'jpg');
    var buffer = new Buffer(event.base64Image, 'base64');

    delete event.base64Image;
    delete event.outputExtension;
    event.srcData = buffer;
    event.dstPath = resizedFile;
    try {
        im.resize(event, function(err, stdout, stderr) {
            if (err) {
                throw err;
            } else {
                console.log('Resize operation completed successfully');
                //S3にputする
                s3.putObject(
                    {"Bucket":event.bucket,
                     "Key":event.outPutName,
                     "Body":new Buffer(fs.readFileSync(resizedFile))
                     },
                    function(err, data){
                        console.log(err);
                        console.log(data);
                        //putが終わったら成功としてLambdaファンクションを閉じる
                        context.succeed(postProcessResource(resizedFile, function(file) {
                            return new Buffer(fs.readFileSync(file));
                        }));

                });
            }
        });
    } catch (err) {
        console.log('Resize operation failed:', err);
        context.fail(err);
    }
};

//最初に呼ばれる関数
exports.handler = function(event, context) {
    //S3から渡ってくるバケットの名前の想定
    var bucket = event.Records[0].s3.bucket.name;
    event.bucket = bucket;
    //画像ファイル名
    var key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    var params = {
        Bucket: bucket,
        Key: key
    };
    // //変換後のファイル名
    event.outPutName = key;

    //S3のファイルを取得
    s3.getObject(params, function(err, data) {
        console.log('start operation');
        gm(data.Body).size(function(err, size) {
            var wid = size.width;
            var hei = size.height;
            var bigger = 0;
            var thres = 1000;
            if (wid > hei) {
                bigger = wid;
            } else {
                bigger = hei;
            }
            console.log('bigger is ' + bigger);

            if (bigger > thres) {
                var ratio = bigger / thres;
                event.width = wid / ratio;
                event.height = hei / ratio;
                event.base64Image = new Buffer(data.Body).toString('base64');
                resize(event, context);
            } else {
                console.log(
                        'width is ' + wid + 'height is ' + hei + ', its small enough
                    );
            }

        })
    }
)};
```

↑のLambdaを作成し、下記でパッケージをダウンロード

```shell
npm install imagemagick gm fs
```

したら、node_modulesとindex.jsをzipしてアップロードすればLambdaは準備完了。

## 2\. ひたすらinvokeする

↑のLambdaは本来、S3に画像ファイルが置かれたときに発火するものです。このままだと手動で動かせません。
しかし、testで使うような、Lambdaが受け取るはずのjsonを手動で投げてやれば手動で動かせます。
それがaws-cliから使えるinvokeという機能。(今更感がスゴイ…)

```shell
aws lambda invoke --invocation-type Event --function-name imageResizer --region ap-northeast-1 --payload file://~/path/to/payload.txt output.txt
```

ここで用意するpayload.txtはこんなもの(参考サイトより)

```json
{
  "Records": [
    {
      "eventVersion": "2.0",
      "eventTime": "1970-01-01T00:00:00.000Z",
      "requestParameters": {
        "sourceIPAddress": "127.0.0.1"
      },
      "s3": {
        "configurationId": "testConfigRule",
        "object": {
          "eTag": "0123456789abcdef0123456789abcdef",
          "sequencer": "0A1B2C3D4E5F678901",
          "key": "<変換したい画像ファイルへのパス>",
          "size": 1024
        },
        "bucket": {
          "arn": "arn:aws:s3:::<変換したい画像ファイルがあるバケット名>",
          "name": "<変換したい画像ファイルがあるバケット名>",
          "ownerIdentity": {
            "principalId": "EXAMPLE"
          }
        },
        "s3SchemaVersion": "1.0"
      },
      "responseElements": {
        "x-amz-id-2": "EXAMPLE123/5678abcdefghijklambdaisawesome/mnopqrstuvwxyzABCDEFGH",
        "x-amz-request-id": "EXAMPLE123456789"
      },
      "awsRegion": "ap-northeast-1",
      "eventName": "ObjectCreated:Put",
      "userIdentity": {
        "principalId": "EXAMPLE"
      },
      "eventSource": "aws:s3"
    }
  ]
}
```

あとはこの画像ファイルへのパスを書き換えて、invokeし続けるだけ。
例えば1MB以上の画像だけリストアップするのならば、

```shell
aws s3 ls s3://my-bucket --recursive --human --sum | grep MiB | tr -s " " | cut -d ' ' -f5 >> largeimage.txt
```

などで画像ファイル名一覧が取得できます。

最後に、次のようなresize.shを用意し、

```shell
filename=$1
cat ${filename} | while read line
do
  gsed -i -e "14c\\          \"key\": \"${line}\"," payload.txt
  aws lambda invoke --invocation-type Event --function-name imageResizer --region ap-northeast-1 --payload file://path/to/payload.txt output.txt
  echo ${line}
done
```

引数にファイル名の入った画像パス一覧を渡せばokです。

```
. resize.sh largeimage.txt
```

## まとめ

極めて場当たり的な対応ですが、これでも一応用は足りるので、同様の事例でお困りの方がいればと思って書きました。
