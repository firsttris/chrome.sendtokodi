let HtmlWebpackPlugin = require('html-webpack-plugin'),
    path = require('path'),
    CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
    return {
        entry: './src/index.tsx',
        output: {
            path: path.join(__dirname, 'build'),
            filename: 'bundle.js',
            clean: true
        },
        module: {
            rules: [
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
                {
                    test: /\.(t|j)sx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                'babel-preset-solid',
                                '@babel/preset-typescript'
                            ]
                        }
                    }
                }
            ],
        },
        resolve: {
            // Add `.ts` and `.tsx` as a resolvable extension.
            extensions: [".ts", ".tsx", ".js", ".jsx"],
            // Add support for TypeScripts fully qualified ESM imports.
            extensionAlias: {
                ".js": [".js", ".ts", ".jsx"],
                ".cjs": [".cjs", ".cts"],
                ".mjs": [".mjs", ".mts"]
            }
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

                            if (env?.TARGET_PLATFORM === 'firefox') {
                                manifest.browser_specific_settings = {
                                    gecko: {
                                        id: "sendtokodi@firsttris.github.io",
                                    }
                                };
                            }

                            return JSON.stringify(manifest, null, 2);
                        },
                    },
                ],
            }),
        ],
    }
};