const path = require('path');
const tsImportPlugin = require('ts-import-plugin');

module.exports = {
    /*if we bundle the developer's app, we would ask them for their entry and output:
        name: 'their/uri' 
        path: 'dirname/uri which we can also do by ourselves via the workspace.workspaceFolder (refer to ext.ts)
    */
    entry: {
        nimble: './src/views/index.tsx'
    },
    output: {
        path: path.resolve(__dirname, 'out'),
        filename: "[name].js"
    },
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