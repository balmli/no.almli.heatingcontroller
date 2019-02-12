#!/usr/bin/env node

const PreProc = require('..')

function cli (args) {
  args = args || process.argv.slice(2)
  const cmd = {
    macros: {}
  }
  const help = `
  prepin [options] [file]

  Options:

    -m macro=1    define macro
    -o <output>   write output to file

  Examples:

    cat sample.js | prepin -m small
        reads from stdin and transpiles using macro "small", writes to stdout.

    prepin -m small=1 -m other sample.js
        pre-process with macros small=1, other on sample.js
  `
  while (args.length) {
    let arg = args.shift()
    if (test('-h|--help', arg)) {
      console.log(help)
      process.exit(1)
    } else if (test('-m|--macro', arg)) {
      arg = args.shift()
      let [macro, value] = arg.split('=')
      cmd.macros[macro] = value || true
    } else if (test('-o|--output', arg)) {
      cmd.output = args.shift()
    } else {
      cmd.input = arg
    }
  }

  return cmd
}

function test (str, arg) {
  return new RegExp(`^(${str})$`).test(arg)
}

module.exports = cli

if (require.main === module) {
  const cmd = cli()
  new PreProc(cmd).proc().catch((e) => console.error(e))
}
