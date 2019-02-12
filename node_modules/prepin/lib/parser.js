'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _require = require('./utils'),
    evaluate = _require.evaluate,
    splitlines = _require.splitlines;

var PATTERN = /^\s*\/\/\s*#(if(?:def|ndef)?|elif|else|endif)\s*(.*)$/;
var COMMENT = '// # ';
var COMMENT_RE = /\/\/\s?#\s/;
var STATES = {
  if: { elif: 1, else: 1, endif: 1 },
  elif: { elif: 1, else: 1, endif: 1 },
  else: { endif: 1 },
  endif: { if: 1, ifdef: 1, ifndef: 1 }
};
STATES.ifdef = STATES.ifndef = STATES.if;

module.exports = Parser;

function Parser(macros) {
  this._eval = evaluate(macros);
  this._state = 'endif';
  this._comment = this._if = false;
}

Parser.prototype = {
  parse: function parse() {
    var _this = this;

    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return splitlines(data).map(function (line) {
      var _ref = PATTERN.exec(line) || [],
          _ref2 = _slicedToArray(_ref, 3),
          l = _ref2[0],
          cmd = _ref2[1],
          expr = _ref2[2]; // eslint-disable-line no-unused-vars


      line = line.replace(COMMENT_RE, '');
      if (_this._isCmd(cmd)) {
        _this._expr(cmd, expr);
      } else if (_this._comment) {
        line = COMMENT + line;
      }
      return line;
    });
  },
  _isCmd: function _isCmd(cmd) {
    if (!cmd) return;
    if (!STATES[this._state][cmd]) {
      var exp = '#' + Object.keys(STATES[this._state]).join(', #');
      throw new Error('got #' + cmd + ' expected ' + exp);
    }
    this._state = cmd;
    return true;
  },
  _expr: function _expr(cmd, expr) {
    if (/^(?:el)?if/.test(cmd)) {
      if (!expr) {
        throw new Error('macro is missing');
      }
      if (cmd === 'ifdef') {
        expr = 'typeof ' + expr + ' !== \'undefined\'';
      } else if (cmd === 'ifndef') {
        expr = 'typeof ' + expr + ' === \'undefined\'';
      }
      var res = this._eval(expr);
      this._if = this._if || res;
      this._comment = !res;
    } else if (cmd === 'else') {
      this._comment = this._if;
    } else if (cmd === 'endif') {
      this._comment = this._if = false;
    }
  }
};