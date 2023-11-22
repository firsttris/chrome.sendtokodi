let HtmlWebpackPlugin = require('html-webpack-plugin'),
    path = require('path'),
    CopyWebpackPlugin = require('copy-webpack-plugin');



module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|eot|svg|ttf|woff|woff2|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: '[path][name][ext]'
                  }
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'SendToKodi',
            filename: 'popup.html'
        }),
        new HtmlWebpackPlugin({
            title: 'SendToKodi',
            filename: 'options.html'
        }),
        new HtmlWebpackPlugin({
            title: 'SendToKodi',
            filename: 'background.html'
        }),
        new CopyWebpackPlugin({
            patterns: [
              {
                from: './public/manifest.json',
                to: 'manifest.json',
                transform(content) {
                  const manifest = JSON.parse(content.toString());
                  manifest.version = process.env.npm_package_version;
                  return JSON.stringify(manifest, null, 2);
                },
              },
            ],
          }),
    ],
    devServer: {
        devMiddleware: {
            writeToDisk: true, // <= what you need to add
          },
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 3000,
        hot: true,
    },
};