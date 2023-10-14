import Tokenizer from "../src/tokenizer";

const markup = `<emailml><container align-v="center" align-h="center" padding="20px" background="#000"><text color="white">Hello World</text></container></emailml>`;
const tokenizer = new Tokenizer(markup);
const tokens = tokenizer.tokenize();

describe("tokenizer tests", () => {
  it("should return complete set of tokens", () => {
    expect(tokens).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "OPEN_TAG", value: "emailml" }),
        expect.objectContaining({ type: "CLOSE_TAG", value: "emailml" }),
        expect.objectContaining({ type: "OPEN_TAG", value: "container" }),
        expect.objectContaining({ type: "CLOSE_TAG", value: "container" }),
        expect.objectContaining({ type: "OPEN_TAG", value: "text" }),
        expect.objectContaining({ type: "CLOSE_TAG", value: "text" }),
      ])
    );
  });

  it("should return all attributes of container tag", () => {
    const containerOpenTag = tokens.find(
      (token) => token.type === "OPEN_TAG" && token.value === "container"
    );
    expect(containerOpenTag).toBeDefined();
    expect(containerOpenTag?.attributes).toBeDefined();
    expect(containerOpenTag?.attributes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "align-v", value: "center" }),
        expect.objectContaining({ name: "align-h", value: "center" }),
        expect.objectContaining({ name: "padding", value: "20px" }),
        expect.objectContaining({ name: "background", value: "#000" }),
      ])
    );
  });

  it("should return all attributes of text tag", () => {
    const containerOpenTag = tokens.find(
      (token) => token.type === "OPEN_TAG" && token.value === "text"
    );
    expect(containerOpenTag).toBeDefined();
    expect(containerOpenTag?.attributes).toBeDefined();
    expect(containerOpenTag?.attributes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "color", value: "white" }),
      ])
    );
  });
});
