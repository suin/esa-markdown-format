import prettier from "prettier";
import remark from "remark";

function format(text: string, { team }: { readonly team: string }): string {
  text = formatUsingRemark(text, { team });
  text = formatUsingPrettier(text);
  return text;
}

function formatUsingPrettier(text: string): string {
  return prettier.format(text, {
    parser: "markdown-nocjsp",
    plugins: [require("prettier-plugin-md-nocjsp")],
  });
}

function formatUsingRemark(
  text: string,
  { team }: { readonly team: string }
): string {
  const file = remark()
    .use(require("remark-lint-code-block-style"), "fenced")
    .use({ settings: { fences: true } })
    .use(require("remark-relative-links"), {
      domainRegex: new RegExp(`http[s]*:\\/\\/${team}\\.esa\\.io[/]?`),
    })
    .processSync(text);
  return file.toString();
}

export default format;
