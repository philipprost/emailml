import Parser, { TagNode } from "../src/parser";
import Tokenizer from "../src/tokenizer";

describe("valid syntax parser tests", () => {
  const markup = `<emailml><container align-v="center" align-h="center" padding="20px" background="#000"><text color="white">Hello World</text></container></emailml>`;
  const tokenizer = new Tokenizer(markup);
  const tokens = tokenizer.tokenize();

  const parser = new Parser(tokens);
  const ast = parser.parse();
  it("should return array with tag root node", () => {
    expect(ast).toBeDefined();
    expect(ast).toBeInstanceOf(Array);
    expect(ast).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "TAG",
          tagName: "emailml",
          attributes: [],
        }),
      ])
    );
  });

  it("root tag node should contain container node", () => {
    const node = ast[0] as TagNode;

    expect(node.children).toBeDefined();
    expect(node.children).toBeInstanceOf(Array);
    expect(node.children).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "TAG",
          tagName: "container",
        }),
      ])
    );
  });

  it("root tag node should contain container node with attributes", () => {
    const node = (ast[0] as TagNode).children[0] as TagNode;

    expect(node.attributes).toBeDefined();
    expect(node.attributes).toBeInstanceOf(Array);
    expect(node.attributes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "align-v", value: "center" }),
        expect.objectContaining({ name: "align-h", value: "center" }),
        expect.objectContaining({ name: "padding", value: "20px" }),
        expect.objectContaining({ name: "background", value: "#000" }),
      ])
    );
  });

  it("container node should contain text child node", () => {
    const node = (ast[0] as TagNode).children[0] as TagNode;

    expect(node.children).toBeDefined();
    expect(node.children).toBeInstanceOf(Array);
    expect(node.children).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "TAG",
          tagName: "text",
        }),
      ])
    );
  });

  it("text node should contain attributes", () => {
    const node = ((ast[0] as TagNode).children[0] as TagNode)
      .children[0] as TagNode;

    expect(node.attributes).toBeDefined();
    expect(node.attributes).toBeInstanceOf(Array);
    expect(node.attributes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "color", value: "white" }),
      ])
    );
  });
});

describe("invalid syntax parser tests", () => {
  it("should throw syntax error for missing closing tag", () => {
    const markup = `<emailml><container align-v="center" align-h="center" padding="20px" background="#000"><text color="white">Hello World</text></container><emailml>`;
    const tokenizer = new Tokenizer(markup);
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    expect(() => parser.parse()).toThrow(
      "Expected CLOSE_TAG, but got undefined"
    );
  });

  it("should throw syntax error for mismatched closing tag", () => {
    const markup = `<emailml><container align-v="center" align-h="center" padding="20px" background="#000"><text color="white">Hello World</text></container></text>`;
    const tokenizer = new Tokenizer(markup);
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    expect(() => parser.parse()).toThrow("Mismatched tag: emailml and text");
  });
});
