"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as vscode from 'vscode';
const vscode_1 = require("vscode");
const { exec } = require('child_process');
function loadScript(context, path) {
    return `<script src="${vscode_1.Uri.file(context.asAbsolutePath(path)).with({ scheme: 'vscode-resource' }).toString()}"></script>`;
}
function activate(context) {
    console.log('Congratulations, your extension "nimble" is now active!', __dirname);
    exec('npx webpack --profile --json > compilation-stats.json', { cwd: __dirname });
    let startCommand = vscode_1.commands.registerCommand('extension.startNimble', () => {
        const panel = vscode_1.window.createWebviewPanel('nimble', 'Nimble', vscode_1.ViewColumn.Beside, { enableScripts: true, });
        panel.webview.html = getWebviewContent(context);
        //check types: front-end should be sending these types back;
        let moduleState = {};
        panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                // case 'config':
                // 	console.log('getting input and configuring webpack');
                // 	moduleState = {
                // 		...message.field
                // 	};
                // 	let moduleObj = createModule(moduleState.module);
                // 	let webpackConfigObject = createWebpackConfig(moduleState.entry, moduleObj);
                /*search workspaceFolder, iterate and search for 'webpack.config.js'
                    if (exists) rename File to old.config.js
                    createFile(URI, buffered(webpackConfigObj))
                        .then(res => {
                            exec('node ../functionalities/chidprocess.ts)
                        })
                    
                */
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
//webpack config functions: 
//entry moduleState.entry:
// function createWebpackConfig(entry: any, mod: any) {
// 	const moduleExports:any = {};
// 	moduleExports.entry = {
// 		main: entry,
// 	};
// 	moduleExports.output = {
// 		filename: 'bundle.js',
// 		path: 'workspace.workspaceFile[0].path'
// 	};
// 	moduleExports.resolve = {
//         extensions: ['.js', '.ts', '.tsx', '.json']
// 	};
// 	moduleExports.module = mod;
//     return moduleExports;
// }
//mod: moduleState.mod
// function createModule(modules: any) {
// 	const module: any = {};
// 	module.rules = [];
// 	if (modules.css) {
// 		module.rules.push({
// 			test: '/\.css$/i',
// 			use: ['style-loader', 'css-loader']
// 		});
// 	}
// 	if (modules.jsx) {
// 		module.rules.push({
// 			test: '/\.(js|jsx)$/', 
// 			exclude: '/node_modules/',
// 			use: [{
// 				loader: 'babel-loader',
// 				options: {presets: ['@babel/preset-env', '@babel/preset-react']}
// 			}]
// 		});
// 	}
// 	//if statement for modules.tsx
// 	return module;
// }
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map