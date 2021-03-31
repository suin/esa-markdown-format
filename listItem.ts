import repeat from "repeat-string";

const checkBullet = require("mdast-util-to-markdown/lib/util/check-bullet");
const checkListItemIndent = require("mdast-util-to-markdown/lib/util/check-list-item-indent");
const flow = require("mdast-util-to-markdown/lib/util/container-flow");
const indentLines = require("mdast-util-to-markdown/lib/util/indent-lines");

/**
 * This code originally came from https://github.com/syntax-tree/mdast-util-to-markdown/blob/0.6.5/lib/handle/list-item.js.
 *
 * この関数はリストのインデントを2スペースから4スペースインデントにするハックが施されたものです。
 */
export default function listItem(node: any, parent: any, context: any) {
  let bullet = checkBullet(context);
  let listItemIndent = checkListItemIndent(context);
  let size: number;
  let value;
  let exit;

  if (parent && parent.ordered) {
    bullet =
      (parent.start > -1 ? parent.start : 1) +
      (context.options.incrementListMarker === false
        ? 0
        : parent.children.indexOf(node)) +
      ".";
  }

  size = bullet.length + 1;

  if (
    listItemIndent === "tab" ||
    (listItemIndent === "mixed" && ((parent && parent.spread) || node.spread))
  ) {
    size = Math.ceil(size / 4) * 4;
  }

  exit = context.enter("listItem");
  value = indentLines(flow(node, context), map);
  exit();

  return value;

  function map(line: any, index: any, blank: any) {
    if (index) {
      return (blank ? "" : repeat("  ", size)) + line; // 4 spaces indentation hack
    }

    return (blank ? bullet : bullet + repeat(" ", size - bullet.length)) + line;
  }
}
