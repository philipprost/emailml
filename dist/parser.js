export default class Parser {
    constructor(tokens) {
        this.current = 0;
        this.tokens = tokens;
    }
    isEnd() {
        return this.current >= this.tokens.length;
    }
    peek() {
        return this.tokens[this.current];
    }
    consume() {
        return this.tokens[this.current++];
    }
    parse() {
        const ast = [];
        while (!this.isEnd()) {
            const node = this.parseNode();
            if (node)
                ast.push(node);
        }
        return ast;
    }
    parseNode() {
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
    parseTagNode() {
        const openTag = this.consume();
        if (openTag.type !== "OPEN_TAG") {
            throw new Error(`Expected OPEN_TAG, but got ${openTag.type}`);
        }
        const children = [];
        while (!this.isEnd() && this.peek().type !== "CLOSE_TAG") {
            const childNode = this.parseNode();
            if (childNode)
                children.push(childNode);
        }
        const closeTag = this.consume();
        if ((closeTag === null || closeTag === void 0 ? void 0 : closeTag.type) !== "CLOSE_TAG") {
            throw new Error(`Expected CLOSE_TAG, but got ${closeTag === null || closeTag === void 0 ? void 0 : closeTag.type}`);
        }
        if ((closeTag === null || closeTag === void 0 ? void 0 : closeTag.value) !== (openTag === null || openTag === void 0 ? void 0 : openTag.value)) {
            throw new Error(`Mismatched tag: ${openTag === null || openTag === void 0 ? void 0 : openTag.value} and ${closeTag === null || closeTag === void 0 ? void 0 : closeTag.value}`);
        }
        return {
            type: "TAG",
            tagName: openTag.value,
            attributes: openTag.attributes || [],
            children,
        };
    }
    parseTextNode() {
        const token = this.consume();
        if (token.type !== "TEXT_CONTENT") {
            throw new Error(`Expected TEXT_CONTENT, but got ${token.type}`);
        }
        return {
            type: "TEXT",
            content: token.value,
        };
    }
}
