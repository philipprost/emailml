export type CommonAttributes = {
  css: string;
  padding: string;
  margin: string;
};

const VALID_CSS_PROPERTIES = new Set([
  "margin",
  "padding",
  "width",
  "height",
  "size",
  "color",
  "weight",
]);

interface IStyleBuilder {
  add: (selector: Selector, style: string) => StyleBuilder;
  get: () => string;
}

export type Selector =
  | "margin"
  | "padding"
  | "size"
  | "color"
  | "background"
  | "width"
  | "height"
  | "weight";

export function getCommonAttributes(attr: {
  [key: string]: string;
}): CommonAttributes {
  const { css = "", padding = "0", margin = "0" } = attr;
  return { css, padding, margin };
}

export function getTextAttributes(attr: { [key: string]: string }): {
  [key: string]: string;
} {
  const { color = "", size = "0", weight = "0" } = attr;
  return { color, size, weight };
}

export function getSelectorCssSelectorName(selector: string): string {
  switch (selector) {
    case "size":
      return "font-size";
    case "background":
      return "background-color";
    case "height":
      return "height";
    case "weight":
      return "font-weight";
    case "width":
      return "width";
    case "color":
      return "color";
    case "margin":
      return "margin";
    case "padding":
      return "padding";
    default:
      throw new Error("Unknown Selector: " + selector);
  }
}

export function CssStyleInliner(attr: { [key: string]: string }) {
  let cssString = "";
  for (const [key, value] of Object.entries(attr)) {
    if (VALID_CSS_PROPERTIES.has(key)) {
      cssString += `${getSelectorCssSelectorName(key)}: ${value}; `;
    }
  }
  return cssString.trim();
}

export class StyleBuilder implements IStyleBuilder {
  styles: string = "";

  add(selector: Selector, style: string | number) {
    this.styles = `${this.styles}${getSelectorCssSelectorName(
      selector
    )}:${style};`;
    return this;
  }

  get() {
    return this.styles;
  }
}
