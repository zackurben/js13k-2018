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
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', 'minify'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
