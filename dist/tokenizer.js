export default class Tokenizer {
    constructor(input) {
        this.current = 0;
        this.input = input;
    }
    isEnd() {
        return this.current >= this.input.length;
    }
    match(pattern) {
        return pattern.exec(this.input.slice(this.current));
    }
    consume(length) {
        this.current += length;
    }
    tokenize() {
        const tokens = [];
        while (!this.isEnd()) {
            let match;
            // Check for open tags
            if ((match = this.match(/^<([a-zA-Z][a-zA-Z0-9-]*)\s*/))) {
                this.consume(match[0].length);
                const attributes = this.tokenizeAttributes();
                tokens.push({
                    type: "OPEN_TAG",
                    value: match[1],
                    attributes,
                });
                continue;
            }
            // Check for close tags
            if ((match = this.match(/^<\/([a-zA-Z][a-zA-Z0-9-]*)>/))) {
                this.consume(match[0].length);
                tokens.push({
                    type: "CLOSE_TAG",
                    value: match[1],
                });
                continue;
            }
            // Text content outside tags
            if ((match = this.match(/^[^<]+/))) {
                this.consume(match[0].length);
                tokens.push({
                    type: "TEXT_CONTENT",
                    value: match[0].trim(),
                });
                continue;
            }
            throw new Error(`[SYNTAX_ERROR] Unexpected syntax at position ${this.current}`);
        }
        return tokens;
    }
    tokenizeAttributes() {
        const attributes = [];
        let match;
        while ((match = this.match(/^([a-zA-Z-]+)="([^"]*)"\s*/))) {
            attributes.push({
                name: match[1],
                value: match[2],
            });
            this.consume(match[0].length);
        }
        // Consume the ending '>'
        if (this.match(/^>/)) {
            this.consume(1);
        }
        else {
            throw new Error(`[SYNTAX_ERROR] Expected '>' at position ${this.current}`);
        }
        return attributes;
    }
}
