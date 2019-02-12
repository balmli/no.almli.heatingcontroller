'use strict';

var _require = require('./utils'),
    read = _require.read,
    write = _require.write;

var Parser = require('./parser');

function Prepin(opts) {
  this.opts = Object.assign({ macros: {} }, opts);
  this.parser = new Parser(this.opts.macros);
  this.opts.output = this.opts.output || this.opts.input;
}

Prepin.prototype = {
  proc: function proc() {
    var _this = this;

    return read(this.opts.input).then(function (lines) {
      return _this.parser.parse(lines).join('\n');
    }).then(function (data) {
      return write(_this.opts.output, data);
    });
  }
};

Prepin.Parser = Parser;
module.exports = Prepin;