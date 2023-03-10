const base = require('./webpack.base.conf');

base.mode = 'development';
base.externals = [
  ({ context, request }, cb) => {
    if (request[0] == '.') {
      cb();
    } else {
      cb(null, "require('" + request + "')");
    }
  },
];

module.exports = base;
