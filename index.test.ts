import outdent from "outdent";
import format from "./index";

test("基本的な用例", () => {
  const input = outdent`
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
  expect(output).toMatchInlineSnapshot(`
    "# ヘッダ

    - リスト
    - リスト

    | カラム1 | カラム2 | カラム3 |
    | ---- | ---- | ---- |
    | a    | b    | c    |

    \`\`\`js
    const uglyCode = function () {
      return \\"omg\\";
    };
    \`\`\`

    \`\`\`
    const indented = \\"code\\";
    \`\`\`

    [絶対URL](/posts/1)
    "
  `);
});

test("コードブロック内のソースコードが整形される", () => {
  const input = outdent`
    ~~~js
    function  a  (  )  {  return 1  }
    ~~~
    
    ~~~css
    div  {  display  :  block  }
    ~~~
  
    ~~~html
    <input  type="text"  >
    ~~~
    
    ~~~json
    {  "key"  :  "value"  }
    ~~~
    
    ~~~yaml
    key   :   value
    ~~~
    `;
  const output = format(input, { team: "example" });
  expect(output).toMatchInlineSnapshot(`
    "\`\`\`js
    function a() {
      return 1;
    }
    \`\`\`

    \`\`\`css
    div {
      display: block;
    }
    \`\`\`

    \`\`\`html
    <input type=\\"text\\" />
    \`\`\`

    \`\`\`json
    { \\"key\\": \\"value\\" }
    \`\`\`

    \`\`\`yaml
    key: value
    \`\`\`
    "
  `);
});

test("コードブロックはバックティックフェンスコードブロックに統一される", () => {
  const input = outdent`
    バックティックフェンスコードブロック:

    \`\`\`
    code
    \`\`\`

    チルダフェンスコードブロック:
    
    ~~~
    code
    ~~~

    4スペースインデントコードブロック:

        code

    タブインデントコードブロック:
    
    ${"\t"}code`;
  const output = format(input, { team: "example" });
  expect(output).toMatchInlineSnapshot(`
    "バックティックフェンスコードブロック:

    \`\`\`
    code
    \`\`\`

    チルダフェンスコードブロック:

    \`\`\`
    code
    \`\`\`

    4スペースインデントコードブロック:

    \`\`\`
    code
    \`\`\`

    タブインデントコードブロック:

    \`\`\`
    code
    \`\`\`
    "
  `);
});

test("リスト記法はすべてハイフンに統一される", () => {
  const input = outdent`
    ハイフンを使ったリスト:
    
    - A
    - B
    - C
    
    アスタリスクを使ったリスト:
    
    * A
    * B
    * C
    
    プラスを使ったリスト:
    
    + A
    + B
    + C`;
  const output = format(input, { team: "example" });
  expect(output).toMatchInlineSnapshot(`
    "ハイフンを使ったリスト:

    - A
    - B
    - C

    アスタリスクを使ったリスト:

    - A
    - B
    - C

    プラスを使ったリスト:

    - A
    - B
    - C
    "
  `);
});

test("絶対URLは相対URLに統一される", () => {
  const input = outdent`
    相対URL:
    
    [テキスト](/)
    [テキスト](/posts/1)
    [テキスト](/posts/1#Header)
    [テキスト](/posts/new)
    
    絶対URL(オートリンク):
    https://example.esa.io/
    https://example.esa.io/posts/1
    https://example.esa.io/posts/1#Header
    https://example.esa.io/posts/new

    絶対URL(HTTPS):
    
    [テキスト](https://example.esa.io/)
    [テキスト](https://example.esa.io/posts/1)
    [テキスト](https://example.esa.io/posts/1#Header)
    [テキスト](https://example.esa.io/posts/new)
    
    絶対URL(HTTP):
    
    [テキスト](http://example.esa.io/)
    [テキスト](http://example.esa.io/posts/1)
    [テキスト](http://example.esa.io/posts/1#Header)
    [テキスト](http://example.esa.io/posts/new)
    
    絶対URL(定義):
    
    詳細は[投稿1]を見て
    
    [投稿1]: https://example.esa.io/posts/1
    
    絶対URL(画像)
    ![テキスト](https://example.esa.io/posts/1.png)
    
    絶対URL(他のesaチーム)
    
    [テキスト](https://other.esa.io/)
    [テキスト](https://other.esa.io/posts/1)
    [テキスト](https://other.esa.io/posts/1#Header)
    [テキスト](https://other.esa.io/posts/new)
    https://other.esa.io/posts/1
    ![画像](https://other.esa.io/posts/1.png)
    詳細は[外部サイト]を見て
    
    [外部サイト]: https://other.esa.io/posts/1
    `;
  const output = format(input, { team: "example" });
  expect(output).toMatchInlineSnapshot(`
    "相対URL:

    [テキスト](/)
    [テキスト](/posts/1)
    [テキスト](/posts/1#Header)
    [テキスト](/posts/new)

    絶対URL(オートリンク):
    [https://example.esa.io/](/)
    [https://example.esa.io/posts/1](/posts/1)
    [https://example.esa.io/posts/1#Header](/posts/1#Header)
    [https://example.esa.io/posts/new](/posts/new)

    絶対URL(HTTPS):

    [テキスト](/)
    [テキスト](/posts/1)
    [テキスト](/posts/1#Header)
    [テキスト](/posts/new)

    絶対URL(HTTP):

    [テキスト](/)
    [テキスト](/posts/1)
    [テキスト](/posts/1#Header)
    [テキスト](/posts/new)

    絶対URL(定義):

    詳細は[投稿1]を見て

    [投稿1]: /posts/1

    絶対URL(画像)
    ![テキスト](/posts/1.png)

    絶対URL(他のesaチーム)

    [テキスト](https://other.esa.io/)
    [テキスト](https://other.esa.io/posts/1)
    [テキスト](https://other.esa.io/posts/1#Header)
    [テキスト](https://other.esa.io/posts/new)
    <https://other.esa.io/posts/1>
    ![画像](https://other.esa.io/posts/1.png)
    詳細は[外部サイト]を見て

    [外部サイト]: https://other.esa.io/posts/1
    "
  `);
});

test("インデントは4スペースに統一される", () => {
  const input = outdent`
  2スペースインデント:
  
  - level 1
    - level 2
      - level 3

  4スペースインデント:
  
  - level 1
      - level 2
          - level 3
          
  2スペースインデントと4スペースインデントの混合:
  
  - level 1
    - level 2
        - level 3

  タブインデント:
  
  - level 1
  ${"\t"} - level 2
  ${"\t\t"} - level 3
  
  ただし、コードブロック内のインデントは2スペースになる:
  
  ~~~js
  function main() {
      return null;
  }
  ~~~
  
  ~~~html
  <div>
      <p>text</p>
  </div>
  ~~~
  `;
  const output = format(input, { team: "example" });
  expect(output).toMatchInlineSnapshot(`
    "2スペースインデント:

    - level 1
        - level 2
            - level 3

    4スペースインデント:

    - level 1
        - level 2
            - level 3

    2スペースインデントと4スペースインデントの混合:

    - level 1
        - level 2
            - level 3

    タブインデント:

    - level 1
        - level 2
            - level 3

    ただし、コードブロック内のインデントは2スペースになる:

    \`\`\`js
    function main() {
      return null;
    }
    \`\`\`

    \`\`\`html
    <div>
      <p>text</p>
    </div>
    \`\`\`
    "
  `);
});
