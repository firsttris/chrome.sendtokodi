let htmlWebpackPlugin = require('html-webpack-plugin'),
  manifest = require('../public/manifest.json'),
  fs = require('fs'),
  fsExtra = require('fs-extra'),
  path = require('path');

// generates the manifest file using the package.json informations
manifest.description = process.env.npm_package_description;
manifest.version = process.env.npm_package_version;

if (process.env?.TARGET_PLATFORM === 'firefox') {
    manifest.browser_specific_settings = {
        gecko: {
            id: "sendtokodi@firsttris.github.io"
        }
    };
}

// clean de dist folder
fsExtra.emptyDirSync(path.join(__dirname, '../build'));

fs.writeFileSync(path.join(__dirname, '../build/manifest.json'), JSON.stringify(manifest));

module.exports = {
  target: 'web',
  entry: {
    main: path.join(__dirname, '../src', 'index.js')
  },
  output: {
    path: path.join(__dirname, '../build'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [{ loader: 'babel-loader' }],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          emitError: false,
          emitWarning: true
        }
      },
      {
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
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [{ loader: 'file-loader?name=img/[name].[ext]' }]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [{ loader: 'file-loader?name=font/[name].[ext]' }]
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      title: 'SendToKodi',
      filename: 'popup.html'
    }),
    new htmlWebpackPlugin({
      title: 'SendToKodi',
      filename: 'options.html'
    }),
    new htmlWebpackPlugin({
      title: 'SendToKodi',
      filename: 'background.html'
    })
  ]
};
