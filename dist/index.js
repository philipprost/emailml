import Tokenizer from "./tokenizer";
import Parser from "./parser";
import ASTToHTMLTransformer from "./transformer";
const EmailML = { Tokenizer, Parser, ASTToHTMLTransformer };
if (this) {
    window.myFunction = EmailML;
}
export default EmailML;
