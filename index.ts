import prettier from "prettier";
import remark from "remark";
import listItem from "./listItem";
import { relativeLinks } from "./relativeLinks";

/**
 * 与えられたMarkdownテキストを整形して返す
 * @param markdownText 整形前のMarkdownテキスト
 * @param options オプション
 * @return 整形済みのMarkdownテキスト
 */
function format(markdownText: string, options: FormatOptions): string {
  const { team } = options;
  markdownText = formatUsingPrettier(markdownText);
  markdownText = formatUsingRemark(markdownText, { team });
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
    parser: "markdown-nocjsp", // prettier本家のMarkdownパーサーは英単語の前後にスペースを入れる問題があるので、この問題を対策がされたパーサーを用いています。
    plugins: [require("prettier-plugin-md-nocjsp")],
  });
}

function formatUsingRemark(
  markdownText: string,
  { team }: { readonly team: string }
): string {
  const file = remark()
    .use(require("remark-gfm"))
    .use({
      settings: {
        fences: true,
        bullet: "-",
        listItemIndent: "one",
        handlers: { listItem },
      },
    })
    .use(relativeLinks, {
      domainRegex: new RegExp(`http[s]*:\\/\\/${team}\\.esa\\.io[/]?`),
    })
    .processSync(markdownText);
  return file.toString();
}

export default format;
