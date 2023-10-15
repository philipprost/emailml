import express from "express";
import path from "path";
import bodyParser from "body-parser";
import EmailML from "../src";

function transform(markup: string) {
  const { ASTToHTMLTransformer, Tokenizer, Parser } = EmailML;
  const transformer = new ASTToHTMLTransformer();
  const tokenizer = new Tokenizer(markup);
  const tokens = tokenizer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  return transformer.transform(ast);
}

const app = express();
const PORT = 3002;

app.use(bodyParser.json());

// Serve static files.
app.use(express.static(path.join(__dirname, "../public")));

app.post("/transform", (req, res) => {
  const emailml = req.body.emailml;

  if (!emailml || typeof emailml !== "string") {
    return res.status(400).send({ error: "Invalid EmailML provided." });
  }

  const transformedHtml = transform(emailml);

  return res.send({ html: transformedHtml });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
