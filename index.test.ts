import format from ".";

describe("format", () => {
  test("usage", () => {
    // language=Markdown
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
    expect(output).toMatchInlineSnapshot(`
      "# ヘッダ

      - リスト
      - リスト

      | カラム1 | カラム2 | カラム3 |
      | ------- | ------- | ------- |
      | a       | b       | c       |

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
});
