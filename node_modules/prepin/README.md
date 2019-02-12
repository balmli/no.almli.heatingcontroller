# prepin

> An in-place pre-processor for javascript files using C style pre-compile
syntax to  compose custom builds from npm-packages.

[![NPM version][badge]][repo]

Pre-processors found on [npm][] require a different file for outputting
processed changes. This is not ideal for in-place custom builds on already
published packages. This pre-processors main purpose is to allow reduction of
package size for e.g. single-page apps on not requiring modules based on macros
given at transpile time.

## Syntax

Follows C style pre-compiler syntax but requires `//` right in front to work in
.js files.

```
// #if expression             // e.g. // #if macro == 1
// #if defined(macro)
// #ifdef macro
// #ifndef macro
// #elif expression           // e.g. // #elif macro == 2
// #else
// #endif
// # is a commented line
```

## Example

Let's assume a `example/sample.js` file, which includes a package of large size which is
required for a specific task is not used in a smaller custom build...

The original file:

```js
// #ifndef small
const big = require('./big-package')
// #else
// # let big // define the alternative
// #endif

if (big) {
  // ...
}
```

If processing with `prepin -m small sample.js` you'll get:

```js
// #ifndef small
// # const big = require('./big-package')
// #else
let big // define the alternative
// #endif

if (big) {
  // ...
}
```

## CLI

```
prepin [options] [file]

Options:

  -m macro=1    define macro
  -o <output>   write output to file

Examples:

  cat sample.js | prepin -m small
      reads from stdin and transpiles using macro "small", writes to stdout.

  prepin -m small=1 -m other sample.js
      pre-process with macros small=1, other on sample.js
```

## API

```js
const Prepin = require('prepin')

const opts = {macros: {small: true}, input: 'sample.js', output: 'sample.js'}

new Prepin(opts).proc().catch((e) => console.error(e))
```

## License

[UNLICENSE][]

[badge]: https://badge.fury.io/js/prepin.svg
[repo]: https://www.npmjs.com/package/prepin

[npm]: https://npmjs.org
[UNLICENSE]: http://unlicense.org
