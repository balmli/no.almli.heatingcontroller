const fs = require('fs')

module.exports = {
  splitlines,
  read,
  write,
  evaluate
}

/**
* @param {string} data
* @return {string[]}
*/
function splitlines (data) {
  return data.split(/(?:\r\n|\r|\n)/g)
}

/**
* @param {path} file
* @return {Promise}
*/
function read (file) {
  let data = ''
  let stream

  if (!file) {
    stream = process.stdin
    stream.setEncoding('utf8')
  } else {
    stream = fs.createReadStream(file, 'utf8')
  }

  return new Promise((resolve, reject) => {
    stream.on('data', (_data) => {
      data += _data
    })
    stream.on('end', () => {
      resolve(data)
    })
    stream.on('error', (err) => {
      reject(err)
    })
  })
}

/**
* @param {path} file
* @param {string} data
* @return {Promise}
*/
function write (file, data) {
  return new Promise((resolve, reject) => {
    if (!file) {
      console.log(data)
      resolve()
    } else {
      if (typeof data !== 'string') {
        data = JSON.stringify(data)
      }
      fs.writeFile(file, data, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    }
  })
}

/**
* @param {object} defines
* @return {function} `function (code)` where {string} code to evaluate
*/
function evaluate (defines) {
  let src = 'function defined (i) { return (typeof i !== "undefined") };\n'
  Object.keys(defines).forEach((key) => {
    src += `var ${key} = ${defines[key]};\n`
  })

  return function (code) {
    let _src = `${src}return ${code};\n`
    try {
      return new Function(_src)() // eslint-disable-line no-new-func
    } catch (e) {
      if (e.name === 'ReferenceError') {
        return false
      } else {
        throw e
      }
    }
  }
}
