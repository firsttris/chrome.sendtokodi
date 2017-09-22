const base = require('./base');
const webpack = require('webpack');
const minify = require('babel-minify-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

base.module.rules.push({
  test: /\.css$/,
  use: ExtractTextPlugin.extract({
    use: 'css-loader?minimize',
    fallback: 'style-loader'
  })
});
base.plugins.push(
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: function(module) {
      // This prevents stylesheet resources with the .css or .scss extension
      // from being moved from their original chunk to the vendor chunk
      if (module.resource && /^.*\.(css|scss)$/.test(module.resource)) {
        return false;
      }
      return module.context && module.context.indexOf('node_modules') !== -1;
    }
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  new minify(),
  new ExtractTextPlugin('styles.css')
);
base.devtool = 'source-map';
module.exports = base;
