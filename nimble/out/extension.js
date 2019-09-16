"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as vscode from 'vscode';
const vscode_1 = require("vscode");
const { exec } = require('child_process');
function loadScript(context, path) {
    return `<script src="${vscode_1.Uri.file(context.asAbsolutePath(path)).with({ scheme: 'vscode-resource' }).toString()}"></script>`;
}
function activate(context) {
    console.log('Congratulations, your extension "nimble" is now active!');
    // exec('npx webpack --profile --json > compilation-stats.json', {cwd: __dirname});
    let startCommand = vscode_1.commands.registerCommand('extension.startNimble', () => {
        const panel = vscode_1.window.createWebviewPanel('nimble', 'Nimble', vscode_1.ViewColumn.Beside, { enableScripts: true, });
        panel.webview.html = getWebviewContent(context);
        //check types: front-end should be sending these types back;
        let moduleState = {};
        panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'config':
                    console.log('getting input and configuring webpack');
                    moduleState = Object.assign({}, message.field);
                    let moduleObj = createModule(moduleState.module);
                    let webpackConfigObject = createWebpackConfig(moduleState.entry, moduleObj);
                    console.log(JSON.stringify(webpackConfigObject));
                /*write webpackConfigObject to path: __dirname (refers to where the extension is installed)
                    .then(res => exec('npx webpack --profile --json > compilation-stats.json', {cwd: __dirname});
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