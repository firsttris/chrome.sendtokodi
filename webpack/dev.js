const base = require('./base');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

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

base.devtool = 'inline-source-map';
module.exports = base;
