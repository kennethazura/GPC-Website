const { resolve } = require('path');

module.exports = {
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  entry: ['./app.mjs'],
  output: {
    filename: 'app.js',
    path: resolve(__dirname, './../dist'),
  },
};
