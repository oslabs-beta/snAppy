"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as vscode from 'vscode';
const vscode_1 = require("vscode");
//node docs;
const { exec } = require('child_process');
// let webpackConfig :any = {
//     entry: {
//         aliens: './src/view/index.tsx'
//     },
//     output: {
//         path: path.resolve(__dirname, 'out'),
//         filename: "[name].js"
//     },
//     optimization: {
//         splitChunks: {
//             cacheGroups: {
//                 vendor: {
//                     test: /node_modules/,
//                     chunks: "initial",
//                     name: "vendor",
//                     priority: 10,
//                     enforce: true
//                 }
//             }
//         }
//     },
//     devtool: 'eval-source-map',
//     resolve: {
//         extensions: ['.js', '.ts', '.tsx', '.json']
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.(ts|tsx)$/,
//                 loader: 'ts-loader',
//                 options: {
//                     getCustomTransformers: () => ({
//                         before: [ tsImportPlugin({
//                           libraryName: 'antd',
//                           libraryDirectory: 'es',
//                           style: true,
//                         }) ]
//                      })
//                 }
//             },
//             {
//                 test: /\.less$/,
//                 use: [
//                     {
//                         loader: 'style-loader'
//                     },
//                     {
//                         loader: 'css-loader',
//                         options: {
//                             importLoaders: 1,
//                             sourceMap: true
//                         }
//                     },
//                     {
//                         loader: 'less-loader',
//                         options: {
//                             javascriptEnabled: true,
//                             sourceMap: true,
//                             modifyVars: {
//                                 '@body-background': 'var(--background-color)',
//                             }
//                         }
//                     }
//                 ]
//             },
//             {
//                 test: /\.css$/,
//                 use: [
//                     {
//                         loader: 'style-loader'
//                     },
//                     {
//                         loader: 'css-loader'
//                     }
//                 ]
//             }
//         ]
//     },
//     performance: {
//         hints: false
//     }
// }
function loadScript(context, path) {
    return `<script src="${vscode_1.Uri.file(context.asAbsolutePath(path)).with({ scheme: 'vscode-resource' }).toString()}"></script>`;
}
function activate(context) {
    console.log('Congratulations, your extension "nimble" is now active!');
    // exec('npx webpack --profile --json > compilation-stats.json', {cwd: __dirname});
    let startCommand = vscode_1.commands.registerCommand('extension.startNimble', () => {
        const panel = vscode_1.window.createWebviewPanel('nimble', 'Nimble', vscode_1.ViewColumn.Beside, { enableScripts: true, });
        panel.webview.html = getWebviewContent(context);
        panel.webview.onDidReceiveMessage(message => {
            console.log(message.command);
            let moduleState;
            switch (message.command) {
                case 'config':
                    console.log('getting input and configuring webpack');
                    console.log('message', message.module);
                    moduleState = Object.assign({}, message.module);
                // let moduleObj = createModule(moduleState.module);
                // let webpackConfigObject = createWebpackConfig(moduleState.entry, moduleObj);
                //console.log(JSON.stringify(webpackConfigObject));
                //converting the object created using function with inputs from front end
                //Uint8Array.from - will convert object to to Uint8 array so we can write to a file
                //let Uint8Obj= Uint8Array.from(webpackConfig)
                //console.log('uint8', Uint8Obj);
                //using workspace.writeFile (path, Uint8 array)
                //workspace.fs.writeFile(__dirname, Uint8Obj)
                /*write webpackConfigObject to path: __dirname (refers to where the extension is installed)
                    .then(res => exec('npx webpack --profile --json > compilation-stats.json', {cwd: __dirname});
                */
                case 'stats':
                    console.log('getting stats');
            }
        });
    });
    context.subscriptions.push(startCommand);
}
exports.activate = activate;
function getWebviewContent(context) {
    return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="Content-Security-Policy">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Nimble</title>
	</head>

	<body>
	<div id="root"></div>
		<script>
		const vscode = acquireVsCodeApi();
		</script>
		${loadScript(context, 'out/nimble.js')}
	</body>
	</html>`;
}
// webpack config functions: 
// entry - moduleState.entry:
function createWebpackConfig(entry, mod) {
    const moduleExports = {};
    moduleExports.entry = {
        main: entry,
    };
    moduleExports.output = {
        filename: 'bundle.js',
        path: 'path'
    };
    moduleExports.resolve = {
        extensions: ['.js', '.ts', '.tsx', '.json']
    };
    moduleExports.module = mod;
    return moduleExports;
}
// mod: moduleState.mod
function createModule(modules) {
    const module = {};
    module.rules = [];
    if (modules.css) {
        module.rules.push({
            test: /\.css$/i,
            use: ['style-loader', 'css-loader']
        });
    }
    if (modules.jsx) {
        module.rules.push({
            test: /\.(js|jsx)$/,
            use: [{
                    loader: 'babel-loader',
                    options: { presets: ['@babel/preset-env', '@babel/preset-react'] }
                }],
            exclude: '/node_modules/'
        });
    }
    //if statement for modules.tsx
    if (module.tsx) {
        module.rules.push({
            test: /\.tsx?$/,
            use: ['ts-loader'],
            exclude: /node_modules/
        });
    }
    if (module.less) {
        module.rules.push({
            test: /\.less$/,
            loader: 'less-loader',
        });
    }
    if (module.sass) {
        module.rules.push({
            test: /\.s[ac]ss$/i,
            use: ['style-loader', 'css-loader', 'sass-loader'],
        });
    }
    return module;
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map