'use strict';

var fs = require('fs');

/**
 * Check the existence of the file
 */
function checkFileExistsSync(filepath){
  var flag = true;

  try {
    fs.accessSync(filepath, fs.F_OK);
  } catch(e){
    flag = false;
  }

  return flag;
};

module.exports = {
 checkFileExistsSync: checkFileExistsSync
};
