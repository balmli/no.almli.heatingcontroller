const {read, write} = require('./utils')
const Parser = require('./parser')

function Prepin (opts) {
  this.opts = Object.assign({macros: {}}, opts)
  this.parser = new Parser(this.opts.macros)
  this.opts.output = this.opts.output || this.opts.input
}

Prepin.prototype = {
  proc () {
    return read(this.opts.input)
    .then((lines) => {
      return this.parser.parse(lines).join('\n')
    })
    .then((data) => (write(this.opts.output, data)))
  }
}

Prepin.Parser = Parser
module.exports = Prepin
