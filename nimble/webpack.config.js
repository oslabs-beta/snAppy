const path = require('path');
const tsImportPlugin = require('ts-import-plugin');

module.exports = {
    entry: {
        nimble: './src/views/index.tsx'
    },
    output: {
        path: path.resolve(__dirname, 'out'),
        filename: "[name].js"
    },
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             vendor: {
    //                 test: /node_modules/,
    //                 chunks: "initial",
    //                 name: "vendor",
    //                 priority: 10,
    //                 enforce: true
    //             }
    //         }
    //     }
    // },
    devtool: 'eval-source-map',
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.json']
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                options: {
                    getCustomTransformers: () => ({
                        before: [ tsImportPlugin({
                          libraryName: 'antd',
                          libraryDirectory: 'es',
                          style: true,
                        }) ]
                     })
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            }
        ]
    },
    performance: {
        hints: false
    }
};