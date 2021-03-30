import prettier from "prettier";
import remark from "remark";

/**
 * 与えられたMarkdownテキストを整形して返す
 * @param markdownText 整形前のMarkdownテキスト
 * @param options オプション
 * @return 整形済みのMarkdownテキスト
 */
function format(markdownText: string, options: FormatOptions): string {
  const { team } = options;
  markdownText = formatUsingRemark(markdownText, { team });
  markdownText = formatUsingPrettier(markdownText);
  return markdownText;
}

/**
 * 整形オプション
 */
export type FormatOptions = {
  /**
   * esaチーム名
   *
   * esaチームのURL`https://***.esa.io`の`***`の部分。ここで指定したチーム内の絶対URLリンクを相対URLリンクに置き換えます。
   */
  readonly team: string;
};

function formatUsingPrettier(markdownText: string): string {
  return prettier.format(markdownText, {
    parser: "markdown-nocjsp",
    plugins: [require("prettier-plugin-md-nocjsp")],
  });
}

function formatUsingRemark(
  markdownText: string,
  { team }: { readonly team: string }
): string {
  const file = remark()
    .use(require("remark-lint-code-block-style"), "fenced")
    .use({ settings: { fences: true } })
    .use(require("remark-relative-links"), {
      domainRegex: new RegExp(`http[s]*:\\/\\/${team}\\.esa\\.io[/]?`),
    })
    .processSync(markdownText);
  return file.toString();
}

export default format;
