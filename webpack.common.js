const path = require('path');
const clean = require('clean-webpack-plugin');
const html = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'a.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  plugins: [
    new clean(['dist']),
    new html({
      filename: path.resolve(__dirname, 'dist/index.html'),
      template: 'index.html'
    })
  ]
};
