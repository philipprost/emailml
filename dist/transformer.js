import { minifyHTML } from "../src/util/minify";
export default class ASTToHTMLTransformer {
    transform(ast) {
        let html = "";
        for (const node of ast) {
            html += this.transformNode(node);
        }
        return html;
    }
    transformNode(node, _width) {
        switch (node.type) {
            case "TAG":
                return this.transformTagNode(node, _width);
            case "TEXT":
                return this.transformTextNode(node, _width);
            default:
                throw new Error(`Unexpected node type: ${node}`);
        }
    }
    transformTagNode(node, _width) {
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
                return this.transformColumnElementNode(node, _width);
            default:
                throw new Error(`Unexpected tag name: ${node.tagName}`);
        }
    }
    transformGridElementNode(node, _width) {
        const { align = "horizontal" } = this.getAttributeMap(node.attributes);
        // Calculate width based on the number of children if aligned horizontally
        const columnCount = node.children.filter((child) => child.tagName === "column").length;
        const columnWidth = columnCount === 0 ? "100%" : `${(100 / columnCount).toFixed(2)}%`;
        let columnsHTML = "";
        for (const child of node.children) {
            columnsHTML += this.transformNode(child, columnWidth);
        }
        return minifyHTML(`<table width="100%" cellspacing="0" cellpadding="0" style="margin: 0; padding: 0; border-collapse: collapse;">${align === "horizontal" ? `<tr>${columnsHTML}</tr>` : columnsHTML}</table>`);
    }
    transformColumnElementNode(node, width) {
        const { alignV = "top", alignH = "left" } = this.getAttributeMap(node.attributes);
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
        return minifyHTML(`<td valign="${verticalAlignment}" align="${horizontalAlignment}" ${width ? `width="${width}"` : ""}>${content}</td>`);
    }
    transformBodyNode(node, _width) {
        let content = "";
        for (const child of node.children) {
            content += this.transformNode(child);
        }
        return minifyHTML(`<!DOCTYPE html><html><body>${content}</body></html>`);
    }
    transformContainerNode(node, _width) {
        const { alignH = "left", alignV = "top", padding = "0px", background = "#FFF", } = this.getAttributeMap(node.attributes);
        // Convert to a table structure for email client compatibility
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
    transformTextElementNode(node, _width) {
        const { color = "#000", weight = "normal", margin = "0px", size = "16px", } = this.getAttributeMap(node.attributes);
        let content = "";
        for (const child of node.children) {
            content += this.transformNode(child);
        }
        return minifyHTML(`<p style="color: ${color}; font-weight: ${weight}; margin: ${margin}; font-size: ${size}">${content}</p>`);
    }
    transformTextNode(node, _width) {
        return node.content;
    }
    getAttributeMap(attributes) {
        return attributes.reduce((acc, attr) => {
            acc[attr.name] = attr.value;
            return acc;
        }, {});
    }
}
