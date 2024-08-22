import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { Configuration, WebpackOptionsNormalized } from 'webpack';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const config: (env: Record<string, boolean | string>, argv: WebpackOptionsNormalized) => Configuration = (env, argv) => {
    return {
        entry: {
            popup: './src/popup.tsx',
            options: './src/options.tsx',
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist'),
            clean: true,
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
            extensions: [".ts", ".tsx", ".js", ".jsx"]
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    { from: 'static' },
                    {
                        from: './manifest.json',
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
                                manifest.permissions = [...manifest.permissions, "<all_urls>"];
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
        devtool: 'source-map'
    }
}




export default config;
