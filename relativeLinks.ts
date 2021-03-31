import { Definition, Image, Link } from "mdast";
import { Node } from "unist";
import visit from "unist-util-visit";

/**
 * Remark plugin to replace absolute links to relative links.
 */
export function relativeLinks(options: { domainRegex: RegExp }) {
  if (!options || !options.domainRegex) {
    throw Error('Missing required "domainRegex" option');
  }

  function visitor(node: Link | Image | Definition): void {
    if (options.domainRegex.test(node.url)) {
      node.url = node.url.replace(options.domainRegex, "/");
    }
  }

  function transform(tree: Node) {
    visit(tree, ["link", "image", "definition"], visitor);
  }

  return transform;
}
