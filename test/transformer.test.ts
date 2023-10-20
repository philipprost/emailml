import Parser from "../src/parser";
import Tokenizer from "../src/tokenizer";
import ASTToHTMLTransformer from "../src/transformer";

describe("transformer valid test", () => {
  test("should have valid html tag", () => {
    const markup = `<emailml></emailml>`;
    const transformer = new ASTToHTMLTransformer();
    const tokenizer = new Tokenizer(markup);
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const html = transformer.transform(ast);

    expect(html).toBe("<!DOCTYPE html><html><body></body></html>");
  });

  test("should transform a container tag", () => {
    const markup = `<container></container>`;
    const transformer = new ASTToHTMLTransformer();
    const tokenizer = new Tokenizer(markup);
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const html = transformer.transform(ast);

    expect(html).toBe(
      `<table width="100%" cellspacing="0" cellpadding="0px" bgcolor="#FFF" style="margin: 0; padding: 0; border-collapse: collapse;"><tr><td valign="top" align="left"></td></tr></table>`
    );
  });

  test("should transform a text tag", () => {
    const markup = `<text></text>`;
    const transformer = new ASTToHTMLTransformer();
    const tokenizer = new Tokenizer(markup);
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const html = transformer.transform(ast);

    expect(html).toBe('<p style=""></p>');
  });

  test("should transform a text attributes correctly", () => {
    const markup = `<text color="#111" weight="bold" margin="25px"></text>`;
    const transformer = new ASTToHTMLTransformer();
    const tokenizer = new Tokenizer(markup);
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const html = transformer.transform(ast);

    expect(html).toBe(
      '<p style="color: #111; font-weight: bold; margin: 25px;"></p>'
    );
  });

  test("should transform a grid tag", () => {
    const markup = `<grid></grid>`;
    const transformer = new ASTToHTMLTransformer();
    const tokenizer = new Tokenizer(markup);
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const html = transformer.transform(ast);

    expect(html).toBe(
      '<table width="100%" cellspacing="0" cellpadding="0" style="margin: 0; padding: 0; border-collapse: collapse;"><tr></tr></table>'
    );
  });

  test("should transform a grid element with columns", () => {
    const markup = `<grid><column>Test 1</column><column>Test 2</column></grid>`;
    const transformer = new ASTToHTMLTransformer();
    const tokenizer = new Tokenizer(markup);
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const html = transformer.transform(ast);

    expect(html).toBe(
      '<table width="100%" cellspacing="0" cellpadding="0" style="margin: 0; padding: 0; border-collapse: collapse;"><tr><td valign="top" align="left" width="50.00%">Test 1</td><td valign="top" align="left" width="50.00%">Test 2</td></tr></table>'
    );
  });

  test("should transform a image element", () => {
    const markup = `<image></image>`;
    const transformer = new ASTToHTMLTransformer();
    const tokenizer = new Tokenizer(markup);
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const html = transformer.transform(ast);

    expect(html).toBe('<img src="" alt="" style=""></img>');
  });
});
