import { minifyHTML } from "../src/util/minify";
import { Attribute, ASTNode, TagNode, TextNode } from "./types";
import { CssStyleInliner } from "./util/attributes";

export default class ASTToHTMLTransformer {
  transform(ast: ASTNode[]): string {
    let html = "";
    for (const node of ast) {
      html += this.transformNode(node);
    }
    return html;
  }

  private transformNode(node: ASTNode): string {
    switch (node.type) {
      case "TAG":
        return this.transformTagNode(node);
      case "TEXT":
        return this.transformTextNode(node);
      default:
        throw new Error(`Unexpected node type: ${node}`);
    }
  }

  private transformTagNode(node: TagNode): string {
    switch (node.tagName) {
      case "emailml":
        return this.transformBodyNode(node);
      case "container":
        return this.transformContainerNode(node);
      case "text":
        return this.transformTextElementNode(node);
      case "grid":
        return this.transformGridElementNode(node);
      case "column":
        return this.transformColumnElementNode(node);
      case "image":
        return this.transformImageElementNode(node);
      default:
        throw new Error(`Unexpected tag name: ${node.tagName}`);
    }
  }

  private transformGridElementNode(node: TagNode): string {
    const { align = "horizontal" } = this.getAttributeMap(node.attributes);

    // Calculate width based on the number of children if aligned horizontally
    const columnCount = (node.children as TagNode[]).filter(
      (child) => child.tagName === "column"
    ).length;
    const columnWidth =
      columnCount === 0 ? "100%" : `${(100 / columnCount).toFixed(2)}%`;

    let columnsHTML = "";

    for (const child of node.children) {
      if ((child as TagNode).tagName === "column") {
        columnsHTML += this.transformColumnElementNode(
          child as TagNode,
          columnWidth
        );
      } else {
        columnsHTML += this.transformNode(child);
      }
    }

    return minifyHTML(
      `<table width="100%" cellspacing="0" cellpadding="0" style="margin: 0; padding: 0; border-collapse: collapse;">${
        align === "horizontal" ? `<tr>${columnsHTML}</tr>` : columnsHTML
      }</table>`
    );
  }

  private transformColumnElementNode(node: TagNode, width?: string): string {
    const { alignV = "top", alignH = "left" } = this.getAttributeMap(
      node.attributes
    );

    const verticalAlignment = {
      top: "top",
      center: "middle",
      bottom: "bottom",
    }[alignV];
    const horizontalAlignment = {
      left: "left",
      center: "center",
      right: "right",
    }[alignH];

    let content = "";
    for (const child of node.children) {
      content += this.transformNode(child);
    }

    return minifyHTML(
      `<td valign="${verticalAlignment}" align="${horizontalAlignment}" ${
        width ? `width="${width}"` : ""
      }>${content}</td>`
    );
  }

  private transformBodyNode(node: TagNode): string {
    let content = "";
    for (const child of node.children) {
      content += this.transformNode(child);
    }
    return minifyHTML(`<!DOCTYPE html><html><body>${content}</body></html>`);
  }

  private transformContainerNode(node: TagNode): string {
    const {
      alignH = "left",
      alignV = "top",
      padding = "0px",
      background = "#FFF",
    } = this.getAttributeMap(node.attributes);

    const horizontalAlignment = {
      left: "left",
      center: "center",
      right: "right",
    }[alignH];

    const verticalAlignment = {
      top: "top",
      center: "middle",
      bottom: "bottom",
    }[alignV];

    let content = "";
    for (const child of node.children) {
      content += this.transformNode(child);
    }

    return minifyHTML(`
      <table width="100%" cellspacing="0" cellpadding="${padding}" bgcolor="${background}" style="margin: 0; padding: 0; border-collapse: collapse;">
        <tr>
            <td valign="${verticalAlignment}" align="${horizontalAlignment}">
                ${content}
            </td>
        </tr>
      </table>
      `);
  }

  private transformTextElementNode(node: TagNode): string {
    const inlineCss = CssStyleInliner(this.getAttributeMap(node.attributes));

    let content = "";
    for (const child of node.children) {
      content += this.transformNode(child);
    }
    return minifyHTML(`<p style="${inlineCss}">${content}</p>`);
  }

  private transformImageElementNode(node: TagNode): string {
    const inlineCss = CssStyleInliner(this.getAttributeMap(node.attributes));
    const { src = "", alt = "" } = this.getAttributeMap(node.attributes);

    let content = "";
    for (const child of node.children) {
      content += this.transformNode(child);
    }

    return minifyHTML(
      `<img src="${src}" alt="${alt}" style="${inlineCss}">${content}</img>`
    );
  }

  private transformTextNode(node: TextNode, _width?: string): string {
    return node.content;
  }

  private getAttributeMap(attributes: Attribute[]): { [key: string]: string } {
    return attributes.reduce((acc, attr) => {
      acc[attr.name] = attr.value;
      return acc;
    }, {} as { [key: string]: string });
  }
}
