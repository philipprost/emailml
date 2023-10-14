#!/usr/bin/env ts-node

import { readFileSync, writeFileSync } from "fs";
import { Command } from "commander";
import Tokenizer from "../tokenizer";
import Parser from "../parser";
import ASTToHTMLTransformer from "../transformer";

const program = new Command();
program.version("1.0.0").description("Convert .eml to HTML");

program
  .command("convert <input>")
  .description("Convert .eml to HTML")
  .option("-o, --output <output>", "Output file name", "output.html")
  .action((input: string, cmdObj: { output?: string }) => {
    let content: string;

    if (input.endsWith(".eml")) {
      content = readFileSync(input, "utf8");
    } else {
      content = input;
    }

    const tokenizer = new Tokenizer(content);
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const transformer = new ASTToHTMLTransformer();
    const html = transformer.transform(ast);

    if (cmdObj.output) {
      writeFileSync(cmdObj.output, html, "utf8");
      console.log(`HTML saved to ${cmdObj.output}`);
    }
  });

program.parse(process.argv);
