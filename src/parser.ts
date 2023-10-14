import { Attribute, Token } from "./tokenizer";

export type ASTNode = TagNode | TextNode;

export interface TagNode {
  type: "TAG";
  tagName: string;
  attributes: Attribute[];
  children: ASTNode[];
}

export interface TextNode {
  type: "TEXT";
  content: string;
}

export default class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private isEnd(): boolean {
    return this.current >= this.tokens.length;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private consume(): Token {
    return this.tokens[this.current++];
  }

  parse(): ASTNode[] {
    const ast: ASTNode[] = [];

    while (!this.isEnd()) {
      const node = this.parseNode();
      if (node) ast.push(node);
    }

    return ast;
  }

  private parseNode(): ASTNode | null {
    const token = this.peek();

    switch (token.type) {
      case "OPEN_TAG":
        return this.parseTagNode();
      case "TEXT_CONTENT":
        return this.parseTextNode();
      default:
        throw new Error(`Unexpected token type: ${token.type}`);
    }
  }

  private parseTagNode(): TagNode {
    const openTag = this.consume();

    if (openTag.type !== "OPEN_TAG") {
      throw new Error(`Expected OPEN_TAG, but got ${openTag.type}`);
    }

    const children: ASTNode[] = [];

    while (!this.isEnd() && this.peek().type !== "CLOSE_TAG") {
      const childNode = this.parseNode();
      if (childNode) children.push(childNode);
    }

    const closeTag = this.consume();
    if (closeTag?.type !== "CLOSE_TAG") {
      throw new Error(`Expected CLOSE_TAG, but got ${closeTag?.type}`);
    }

    if (closeTag?.value !== openTag?.value) {
      throw new Error(
        `Mismatched tag: ${openTag?.value} and ${closeTag?.value}`
      );
    }

    return {
      type: "TAG",
      tagName: openTag.value!,
      attributes: openTag.attributes || [],
      children,
    };
  }

  private parseTextNode(): TextNode {
    const token = this.consume();

    if (token.type !== "TEXT_CONTENT") {
      throw new Error(`Expected TEXT_CONTENT, but got ${token.type}`);
    }

    return {
      type: "TEXT",
      content: token.value!,
    };
  }
}
