const path = require('path');
const glob = require('glob');

module.exports = {
  entry: Object.fromEntries(glob.sync(path.resolve(__dirname, './../assets/js/**/*.js')).map((v) => [
    v.split('assets/js/')[1], v,
  ])),
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, './../public/js'),
  },
  module: {
    rules: [
      // Compile es6 to js.
      { test: /\.js$/, use: 'babel-loader' },
    ],
  },
};
