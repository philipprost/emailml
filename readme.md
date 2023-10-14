# EmailML

Easily convert custom markup language (EmailML) to universally supported HTML, specifically optimized for email clients.

## Features

- Command-Line Interface: Quickly convert .eml files or strings to HTML.
- Built With TypeScript: Type safety ensures robust operations and fewer runtime errors.
- Supports Custom Markup: Special elements like <container>, <text>, and <grid> are fully supported.
- Outputs Optimized HTML: The generated HTML is minified and optimized for email clients, ensuring maximum compatibility.

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
```

2. Navigate to the project directory:

```bash
cd EMAILML
```

3. Install the required dependencies:

```bash
Install the required dependencies:
```

## Usage

### Via ts-node (Recommended)

If you have ts-node installed globally:

```bash
ts-node src/index.ts convert [input] -o [output]
```

Or if you're using a local installation:

```bash
npx ts-node src/index.ts convert [input] -o [output]
```

## Build and Run

1. Build the TypeScript files:

```bash
npm run build
```

2. Run the compiled JavaScript:

```bash
node dist/index.js convert [input] -o [output]
```

## Commands

- `convert <input>`: Convert a given .eml file or string to HTML.
- `-o, --output <output>`: Specify the output file name (default is output.html).

## Contributing

Feel free to open issues, offer feedback, and send Pull Requests. All contributions are welcome!

## License

MIT
