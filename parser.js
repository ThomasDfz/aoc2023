const fs = require('fs');
const path = require('path');

module.exports = () => fs
  .readFileSync(path.join(path.dirname(require.main.filename), 'input.txt'), 'utf8')
  .toString()
  .trim()
  .replaceAll('\r\n', '\n');
