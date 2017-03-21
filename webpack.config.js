let webpack = require("webpack"),
  path = require("path"),
  fileSystem = require("fs"),
  env = require("./utils/env"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  WriteFilePlugin = require("write-file-webpack-plugin");

// load the secrets
let alias = {};
const secretsPath = path.join(__dirname, ("secrets." + env.NODE_ENV + ".js"));
if (fileSystem.existsSync(secretsPath)) {
  alias["secrets"] = secretsPath;
}

let webpackPlugins = [
  // expose and write the allowed env vars on the compiled bundle
  // strip comments in Vue code
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.BROWSER': true
  }),
  new HtmlWebpackPlugin({
    template: path.join(__dirname, "src", "popup.html"),
    filename: "popup.html",
    chunks: ["popup"]
  }),
  new HtmlWebpackPlugin({
    template: path.join(__dirname, "src", "options.html"),
    filename: "options.html",
    chunks: ["options"]
  }),
  new HtmlWebpackPlugin({
    template: path.join(__dirname, "src", "background.html"),
    filename: "background.html",
    chunks: ["background"]
  }),
  new WriteFilePlugin()
];

if (process.env.NODE_ENV === 'production') {
  webpackPlugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    })
  );
}

module.exports = {
  entry: {
    popup: path.join(__dirname, "src", "js", "popup.js"),
    options: path.join(__dirname, "src", "js", "options.js"),
    background: path.join(__dirname, "src", "js", "background.js")
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {test: /\.js$/, loader: "buble-loader"},
      {test: /\.css$/, loader: "style-loader!css-loader"},
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(woff2?|woff|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          name: 'icons/[name].[ext]'
        }
      }
    ]
  },
  resolve: {
    alias: alias
  },
  plugins: webpackPlugins,
  devtool: 'source-map'
};
