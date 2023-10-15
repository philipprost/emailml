export type ASTNode = TagNode | TextNode;

export type Attribute = {
  name: string;
  value: string;
};

export type TokenType = "OPEN_TAG" | "CLOSE_TAG" | "TEXT_CONTENT" | "ATTRIBUTE";

export interface Token {
  type: TokenType;
  value?: string;
  attributes?: Attribute[];
}

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
