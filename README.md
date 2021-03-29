# @suin/esa-markdown-format

esa.ioのMarkdownを自動整形する関数です。

## 特徴

- PrettierによるMarkdownの自動整形
- PrettierによるMarkdown内コードブロックの自動整形
- esa内部リンクを絶対URLから相対URLにする

## インストール

```bash
yarn add @suin/esa-markdown-format
# or
npm install @suin/esa-markdown-format
```

## 使い方

`format`関数にフォーマットしたいMarkdownとチーム名を渡すと、フォーマットされたMarkdownが返ります:

```ts
import format from "@suin/esa-markdown-format";

const input = `
ヘッダ
=====

* リスト
* リスト

|カラム1|カラム2|カラム3|
|---|---|---|
|a|b|c|

~~~js
const uglyCode=function(){return 'omg'}
~~~

    const indented = "code";

[絶対URL](https://example.esa.io/posts/1)`;

const output = format(input, { team: "example" });
```

`output`の内容:

````markdown
# ヘッダ

- リスト
- リスト

| カラム1 | カラム2 | カラム3 |
| ------- | ------- | ------- |
| a       | b       | c       |

```js
const uglyCode = function () {
  return "omg";
};
```

```
const indented = "code";
```

[絶対URL](/posts/1)
````

## API リファレンス

https://suin.github.io/esa-markdown-format/
