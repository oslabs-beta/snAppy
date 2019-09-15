"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as vscode from 'vscode';
const vscode_1 = require("vscode");
function loadScript(context, path) {
    return `<script src="${vscode_1.Uri.file(context.asAbsolutePath(path)).with({ scheme: 'vscode-resource' }).toString()}"></script>`;
}
function activate(context) {
    console.log('Congratulations, your extension "nimble" is now active!');
    let startCommand = vscode_1.commands.registerCommand('extension.startNimble', () => {
        const panel = vscode_1.window.createWebviewPanel('nimble', 'Nimble', vscode_1.ViewColumn.Beside, { enableScripts: true, });
        panel.webview.html = getWebviewContent(context);
        //check types: front-end should be sending these types back;
        let entryState;
        let moduleState = {};
        panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'entry':
                    console.log('getting entry point');
                    //there will only be one entry point
                    entryState.push(message.entry);
                case 'module':
                    console.log('getting module');
                    //copy obj to moduleState.
                    moduleState = Object.assign({}, message.module);
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
function createWebpackConfig(entry, mod) {
    const moduleExports = {};
    moduleExports.entry = {
        main: entry,
    };
    moduleExports.output = {
        filename: 'bundle.js',
        path: vscode_1.workspace.workspaceFile[0].path
    };
    moduleExports.resolve = {
        extensions: ['.js', '.ts', '.tsx', '.json']
    };
    moduleExports.module = mod;
    return moduleExports;
}
function createModule(modules) {
    const module = {};
    module.rules = [];
    if (modules.css) {
        module.rules.push({
            test: '/\.css$/i',
            use: ['style-loader', 'css-loader']
        });
    }
    if (modules.jsx) {
        module.rules.push({
            test: '/\.jsx?/',
            exclude: '/node_modules/',
            use: [{
                    loader: 'babel-loader',
                    options: { presets: ['@babel/preset-env', '@babel/preset-react'] }
                }]
        });
    }
    return module;
}
let module1 = (createModule({
    css: true,
    jsx: true
}));
console.log(createWebpackConfig('./index.js', module1));
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map