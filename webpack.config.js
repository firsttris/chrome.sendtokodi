let HtmlWebpackPlugin = require('html-webpack-plugin'),
    manifest = require('./public/manifest.json'),
    fs = require('fs'),
    fsExtra = require('fs-extra'),
    path = require('path');

// generates the manifest file using the package.json informations
manifest.description = process.env.npm_package_description;
manifest.version = process.env.npm_package_version;

// clean de dist folder
fsExtra.emptyDirSync(path.join(__dirname, './build'));

fs.writeFileSync(path.join(__dirname, './build/manifest.json'), JSON.stringify(manifest));

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