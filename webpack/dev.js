const base = require('./base'),
  FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin'),
  WriteFilePlugin = require('write-file-webpack-plugin');

base.module.rules.push({
  test: /\.css$/,
  use: [
    {
      loader: 'style-loader',
      options: {
        sourceMap: true
      }
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap: true
      }
    }
  ]
});

base.plugins.push(new FriendlyErrorsWebpackPlugin());
base.plugins.push(new WriteFilePlugin());

base.devtool = 'inline-source-map';
module.exports = base;
