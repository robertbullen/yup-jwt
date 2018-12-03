# yup-jwt

Adds an extension to the [yup](https://www.npmjs.com/package/yup) library to validate that a string is a decode-able JSON Web Token. [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) is used to perform the validation under the hood.

## Usage

### Installing

```bash
npm install yup-jwt
```

### Invoking

This project adds a single method to yum: `StringSchema.jwt()`. It's TypeScript definition is:

```typescript
// TypeScript module augmentation.

declare module 'yup' {
    export interface StringSchema {
        jwt(message?: string): StringSchema;
    }
}
```

Building a schema is accomplished identically to the other specialized `StringSchema` methods, like `StringSchema.email()` or `StringSchema.url()`:

```javascript
// A simple example in JavaScript.

const yup = require('yup');
require('yup-jwt');

const schema = yup.string().jwt();

const token = '...';

schema.validateSync(token);
```

## Toolchain

The main tools used for authoring this project are:

- TypeScript
- Prettier
- TSLint
- Jest/ts-jest

These two tutorials for publishing TypeScript-based projects were useful:

- [Step by step: Building and publishing an NPM Typescript package](https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c)
- [How to Create and Publish an NPM module in TypeScript](https://codeburst.io/https-chidume-nnamdi-com-npm-module-in-typescript-12b3b22f0724)

### Prettier Configuration

Prettier's configuration is placed in `.prettierrc`, which specifies only options that deviate from Prettier's defaults. JSON and markdown files are ignored.

### TSLint Configuration

TSLint's configuration is found in `tslint.json` and starts with `"tslint:latest"`. It adjusts for the aforementioned code formatting preferences of Prettier by also extending `"tslint-config-prettier"`, and then adds just a couple of customized rules beyond that.

### TypeScript Configuration

There are two TypeScript configuration files, one for standard builds and a second one for running the unit tests. The standard build configuration file, `tsconfig.json` started with the output from `tsc init` (of TypeScript 3.2) and made a couple tweaks for ultimate compiler scrictness.

The unit test configuration file, `tsconfig.test.json`, extends the standard build subtly: The only difference between the two is their runtime `"target"` and `"include"` entry point. Standard builds keep the browser in mind and therefore target ES5. Unit tests execute within Node.js (v8 at the time of this writing) and therefore can target ES2017, which is closer to the style of source code, although because unit tests are executed with `ts-jest`, unit test code is never emitted.

## Testing

Unit tests are written for and executed by `jest`/`ts-jest`. They can be invoked as follows:

```bash
npm test
```

## Building

Building consists of performing a clean, compiling with TypeScript, and finally linting with TSLint.

```bash
npm run build

# The above command is equivalent to:
npm run clean
npm run compile
npm run lint
```

JavaScript is emitted to the `./dist` subdirectory.
