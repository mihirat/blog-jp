---
title: 【Python】 scikit-learnでメモリに困ったらスパース表現がよい
tags: ["python", "ml"]
published: 2017-02-26
category: Tech
draft: false
---


100万×100万の行列を作って、機械学習をぶん回して…とやっていると
本当に心配になるくらいmacが熱くなりますし、メモリも食って、計算終わらなくて。。。
ということでスパース表現ですね。

## スパース表現とは

行列の要素のほとんどが0、わずかにしか値が入ってないようなとき、
例えばこんなん

```python
array([[4, 0, 9, 0],
       [0, 7, 0, 0],
       [0, 0, 0, 0],
       [0, 0, 0, 5]])
```

０をわざわざデータとして保持するんじゃなくて、
わずかに入る値とその位置だけ保持して、あとは0であるとみなすことで
持っているべき情報量を落とすための表現です。
つまり、上の行列は

```python
row  = np.array([0, 3, 1, 0])
col  = np.array([0, 3, 1, 2])
data = np.array([4, 5, 7, 9])
```

みたいに表せます。rowとcolがデータの位置、dataがそこに入る値になってます。
これを

```python
sparse_matrix = coo_matrix((data, (row, col)), shape=(4, 4))
```

というようにしてスパース行列にします。[参考：公式](https://docs.scipy.org/doc/scipy-0.18.1/reference/generated/scipy.sparse.coo_matrix.html#scipy.sparse.coo_matrix)
元の、全ての値を保持する表現はスパースに対してデンス(dense)と呼ばれます。
[こちらの記事](http://qiita.com/kazk1018/items/c338b2883b4a58298bcf)が詳しい。

## denseの扱いとの違い

基本的にはdenseの場合と同様の処理ができます。
ただ、一般的な結合などもスパース行列用に関数がありますのでそちらを利用します。[例：縦方向の結合](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.vstack.html)

## scikit-learnと一緒に使う

scikit-learnの多くのアルゴリズムはスパース行列に対応してるので、
今まで普通に行列を引数で渡していたように引数に渡せます。
例えば[推薦システム](http://www.kamishima.net/archive/recsys.pdf)などに使う[非負値行列因子分解(Non-negative Matrix Factorization)](http://scikit-learn.org/stable/modules/generated/sklearn.decomposition.NMF.html)のParameterの項を見ると

> X: {array-like, sparse matrix}, shape (n_samples, n_features) : Data matrix to be decomposed

となってるので、sparse matrixを引数に取れるよ、ということですね。
NMFについては[こちら](http://qiita.com/takechanman/items/6d1f65f94f7aaa016377)がわかりやすい。
実例はこんな感じ　<http://www.benfrederickson.com/matrix-factorization/>

## 注意事項

拙作よりもこちらの記事を読んだ方がよいですが
<http://hamukazu.com/2014/01/30/sparse-vector-with-scipy-sparse/>

使うためだけの説明をすると、COOは計算に向かないので、CSRかCSCにします。
CSRは行方向、CSCは列方向の計算を高速化するので、行列の形に応じて使い分けしましょう。

## サンプルコード

例えばさきほどのNMFでは

```python
import pandas as pd
import numpy as np
import scipy
from sklearn.decomposition import NMF

def feature_extraction(mat_coo, num_features):
    X = mat_coo.tocsr()
    model = NMF(n_components=num_features, init='random', random_state=0)
    model.fit(X)
    print('feature extraction done')
    return model.components_

if __name__ == '__main__':

    num_features = 3
    print('now loading...')
    row  = np.array([0, 3, 1, 0])
    col  = np.array([0, 3, 1, 2])
    data = np.array([4, 5, 7, 9])
    mat_coo = scipy.sparse.coo_matrix((data, (row, col)), shape=(4, 4))

    features = feature_extraction(mat_coo, num_features)

```

みたいな感じでできます。

圧倒的に高速なので、データがスパースな場合にはぜひ活用しましょう。
