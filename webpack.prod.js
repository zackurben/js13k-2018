const webpack = require('webpack');
const path = require('path');
const clean = require('clean-webpack-plugin');
const html = require('html-webpack-plugin');
const common = require('./webpack.common');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

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
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/i,
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }]
        },
        canPrint: true
      })
    ]
  },
  plugins: [new MiniCssExtractPlugin(), new webpack.IgnorePlugin(/MapEditor/)],
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
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  }
});
