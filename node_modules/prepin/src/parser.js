const {evaluate, splitlines} = require('./utils')

const PATTERN = /^\s*\/\/\s*#(if(?:def|ndef)?|elif|else|endif)\s*(.*)$/
const COMMENT = '// # '
const COMMENT_RE = /\/\/\s?#\s/
const STATES = {
  if: {elif: 1, else: 1, endif: 1},
  elif: {elif: 1, else: 1, endif: 1},
  else: {endif: 1},
  endif: {if: 1, ifdef: 1, ifndef: 1}
}
STATES.ifdef = STATES.ifndef = STATES.if

module.exports = Parser

function Parser (macros) {
  this._eval = evaluate(macros)
  this._state = 'endif'
  this._comment = this._if = false
}

Parser.prototype = {
  parse (data = '') {
    return splitlines(data).map((line) => {
      const [l, cmd, expr] = PATTERN.exec(line) || [] // eslint-disable-line no-unused-vars
      line = line.replace(COMMENT_RE, '')
      if (this._isCmd(cmd)) {
        this._expr(cmd, expr)
      } else if (this._comment) {
        line = COMMENT + line
      }
      return line
    })
  },

  _isCmd (cmd) {
    if (!cmd) return
    if (!STATES[this._state][cmd]) {
      let exp = '#' + Object.keys(STATES[this._state]).join(', #')
      throw new Error(`got #${cmd} expected ${exp}`)
    }
    this._state = cmd
    return true
  },

  _expr (cmd, expr) {
    if (/^(?:el)?if/.test(cmd)) {
      if (!expr) {
        throw new Error('macro is missing')
      }
      if (cmd === 'ifdef') {
        expr = `typeof ${expr} !== 'undefined'`
      } else if (cmd === 'ifndef') {
        expr = `typeof ${expr} === 'undefined'`
      }
      let res = this._eval(expr)
      this._if = this._if || res
      this._comment = !res
    } else if (cmd === 'else') {
      this._comment = this._if
    } else if (cmd === 'endif') {
      this._comment = this._if = false
    }
  }
}
