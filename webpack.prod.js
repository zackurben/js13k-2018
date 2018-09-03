const path = require('path');
const clean = require('clean-webpack-plugin');
const html = require('html-webpack-plugin');
const common = require('./webpack.common');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        uglifyOptions: {
          ecma: 5,
          compress: {
            keep_fargs: false,
            passes: 7
          },
          mangle: {},
          toplevel: true
        }
      })
    ]
  }
});
