import { CssStyleInliner, StyleBuilder } from "../src/util/attributes";

describe("util tester", () => {
  it("should return style builder font size styling", () => {
    const builder = new StyleBuilder();
    const css = builder.add("size", "21px").get();
    expect(css).toBe("font-size:21px;");
  });

  it("should return style builder font weight styling", () => {
    const builder = new StyleBuilder();
    const css = builder.add("weight", "400").get();
    expect(css).toBe("font-weight:400;");
  });

  it("should return style builder background color styling", () => {
    const builder = new StyleBuilder();
    const css = builder.add("background", "#FFFFFF").get();
    expect(css).toBe("background-color:#FFFFFF;");
  });

  it("should return style builder selector string", () => {
    const builder = new StyleBuilder();
    const css = builder
      .add("color", "#E2E2E2")
      .add("background", "gray")
      .add("height", 300)
      .add("margin", "12px")
      .add("padding", "6px")
      .add("size", "32px")
      .add("weight", 400)
      .add("width", 600)
      .get();

    expect(css).toBe(
      "color:#E2E2E2;background-color:gray;height:300;margin:12px;padding:6px;font-size:32px;font-weight:400;width:600;"
    );
  });

  it("should inline attributes into valid css", () => {
    const inline = CssStyleInliner({
      width: "200px",
      height: "400px",
      size: "21px",
    });
    expect(inline).toBe("width: 200px; height: 400px; font-size: 21px;");
  });
});
