"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const vscode_uri_1 = require("vscode-uri");
// node docs;
const { exec } = require('child_process');
const configs = require("./functions/webpackFunctions");
const traverseParseFunctions_1 = require("./functions/traverseParseFunctions");
const path = require('path');
function loadScript(context, path) {
    return `<script src="${vscode_1.Uri.file(context.asAbsolutePath(path)).with({ scheme: 'vscode-resource' }).toString()}"></script>`;
}
function activate(context) {
    console.log('Congratulations, your extension "snAppy" is now active!');
    const startCommand = vscode_1.commands.registerCommand('extension.startSnappy', () => {
        const panel = vscode_1.window.createWebviewPanel('snAppy', 'snAppy!', vscode_1.ViewColumn.Beside, { enableScripts: true, retainContextWhenHidden: true });
        panel.webview.html = getWebviewContent(context);
        panel.webview.onDidReceiveMessage((message) => {
            // console.log('this is the message.entry: ', message.entry);
            switch (message.command) {
                //button: config, build and get stats of app:
                case 'config':
                    let moduleState = Object.assign({ entry: message.entry }, message.module);
                    configs.runWriteWebpackBundle(moduleState, panel);
                    break;
                case 'optimize':
                    // console.log('optimizing:', message.entry)
                    let resolvedEntry = path.resolve(`${(vscode_1.workspace.workspaceFolders ? vscode_1.workspace.workspaceFolders[0].uri.path : '/') + message.entry}`);
                    ///src/client/index.js
                    traverseParseFunctions_1.default(resolvedEntry, resolvedEntry);
                    return exec('npx webpack --profile --json > compilation-stats.json', { cwd: __dirname }, (err, stdout) => {
                        vscode_1.workspace.fs.readFile(vscode_uri_1.URI.file(path.join(__dirname, 'compilation-stats.json')))
                            .then(res => {
                            return panel.webview.postMessage({ command: 'post', field: res.toString() });
                        });
                    });
                    break;
                case 'export':
                    console.log('exporting files');
                    vscode_1.workspace.fs.createDirectory((vscode_uri_1.URI.file(vscode_1.workspace.workspaceFolders ? vscode_1.workspace.workspaceFolders[0].uri.path + '/snappy' : '/')));
                    vscode_1.workspace.fs.readFile(vscode_uri_1.URI.file(path.join(__dirname, 'webpack.config.js')))
                        .then(res => {
                        // console.log('creating file', URI.file(workspace.workspaceFolders? workspace.workspaceFolders[0].uri.path + '/webpack.config.js': '/'));
                        vscode_1.workspace.fs.writeFile(vscode_uri_1.URI.file(vscode_1.workspace.workspaceFolders ? vscode_1.workspace.workspaceFolders[0].uri.path + '/snappy/webpack.config.js' : '/'), res);
                    });
                    vscode_1.workspace.fs.readFile(vscode_uri_1.URI.file(path.join(__dirname, 'compilation-stats.json')))
                        .then(res => {
                        console.log('creating file', vscode_uri_1.URI.file(vscode_1.workspace.workspaceFolders ? vscode_1.workspace.workspaceFolders[0].uri.path + '/compilation-stats.json' : '/'));
                        vscode_1.workspace.fs.writeFile(vscode_uri_1.URI.file(vscode_1.workspace.workspaceFolders ? vscode_1.workspace.workspaceFolders[0].uri.path + '/snappy/compilation-stats.json' : '/'), res);
                    });
                // workspace.fs.copy(URI.file(`${__dirname}/compilation-stats.json`),URI.file(workspace.workspaceFolders? workspace.workspaceFolders[0].uri.path : '/'))
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
		<title>Snappy</title>
	</head>

	<body>
	<div id="root"></div>
		<script>
		const vscode = acquireVsCodeApi();
		</script>
		${loadScript(context, 'out/snappy.js')}
	</body>
	</html>`;
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map