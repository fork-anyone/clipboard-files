// Native addon, exposing low-level C++ bindings
const path = require('path');
const binary = require('@mapbox/node-pre-gyp');
const binding_path = binary.find(path.resolve(path.join(__dirname, '../package.json')));
const native = require(binding_path);

// ?? readFilesAsync ? Promise
function readFilesAsync() {
  return new Promise((resolve, reject) => {
    native.readFilesAsync((err, files) => {
      if (err) return reject(err);
      resolve(files);
    });
  });
}

// ?? writeFilesAsync ? Promise
function writeFilesAsync(files) {
  return new Promise((resolve, reject) => {
    native.writeFilesAsync((err, result) => {
      if (err) return reject(err);
      resolve(result); // ??????????? result
    }, files);
  });
}

// ??????????????
const {
  readFiles,
  writeFiles,
  readText,
  writeText,
  version
} = native;

// ?? API
module.exports = {
  readFiles,
  writeFiles,
  readText,
  writeText,
  version,
  readFilesAsync,
  writeFilesAsync
};