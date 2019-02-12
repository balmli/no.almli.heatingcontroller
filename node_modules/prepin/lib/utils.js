'use strict';

var fs = require('fs');

module.exports = {
  splitlines: splitlines,
  read: read,
  write: write,
  evaluate: evaluate
};

/**
* @param {string} data
* @return {string[]}
*/
function splitlines(data) {
  return data.split(/(?:\r\n|\r|\n)/g);
}

/**
* @param {path} file
* @return {Promise}
*/
function read(file) {
  var data = '';
  var stream = void 0;

  if (!file) {
    stream = process.stdin;
    stream.setEncoding('utf8');
  } else {
    stream = fs.createReadStream(file, 'utf8');
  }

  return new Promise(function (resolve, reject) {
    stream.on('data', function (_data) {
      data += _data;
    });
    stream.on('end', function () {
      resolve(data);
    });
    stream.on('error', function (err) {
      reject(err);
    });
  });
}

/**
* @param {path} file
* @param {string} data
* @return {Promise}
*/
function write(file, data) {
  return new Promise(function (resolve, reject) {
    if (!file) {
      console.log(data);
      resolve();
    } else {
      if (typeof data !== 'string') {
        data = JSON.stringify(data);
      }
      fs.writeFile(file, data, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }
  });
}

/**
* @param {object} defines
* @return {function} `function (code)` where {string} code to evaluate
*/
function evaluate(defines) {
  var src = 'function defined (i) { return (typeof i !== "undefined") };\n';
  Object.keys(defines).forEach(function (key) {
    src += 'var ' + key + ' = ' + defines[key] + ';\n';
  });

  return function (code) {
    var _src = src + 'return ' + code + ';\n';
    try {
      return new Function(_src)(); // eslint-disable-line no-new-func
    } catch (e) {
      if (e.name === 'ReferenceError') {
        return false;
      } else {
        throw e;
      }
    }
  };
}