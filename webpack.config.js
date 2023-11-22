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
                // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
                { test: /\.([cm]?ts|tsx)$/, loader: "ts-loader" }
            ],
        },
        resolve: {
            // Add `.ts` and `.tsx` as a resolvable extension.
            extensions: [".ts", ".tsx", ".js"],
            // Add support for TypeScripts fully qualified ESM imports.
            extensionAlias: {
                ".js": [".js", ".ts"],
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
        devServer: {
            devMiddleware: {
                writeToDisk: true,
            },
            static: {
                directory: path.join(__dirname, 'dist'),
            },
            compress: true,
            port: 3000,
            hot: true,
        },
    }
};