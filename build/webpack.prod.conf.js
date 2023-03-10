const webpack = require('webpack');
const { resolve } = require('path');
const base = require('./webpack.base.conf');

base.mode = 'production';
base.plugins = [
  new webpack.ContextReplacementPlugin(
    /express\/lib/,
    resolve(__dirname, '../node_modules'),
    {
      ejs: 'ejs',
    },
  ),
];
base.stats = {
  warningsFilter: /require\.extensions/,
};

module.exports = base;
