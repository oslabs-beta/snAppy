"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as vscode from 'vscode';
const vscode_1 = require("vscode");
// const path = require('path');
//this is the new code we copied from aliens
const path = require("path");
function loadScript(context, path) {
    return `<script src="${vscode_1.Uri.file(context.asAbsolutePath(path)).with({ scheme: 'vscode-resource' }).toString()}"></script>`;
}
function activate(context) {
    console.log('Congratulations, your extension "nimble" is now active!');
    let startCommand = vscode_1.commands.registerCommand('extension.startNimble', () => {
        const panel = vscode_1.window.createWebviewPanel('nimble', 'Nimble', vscode_1.ViewColumn.Beside, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [vscode_1.Uri.file(path.join(context.extensionPath, 'out'))]
        });
        panel.webview.html = getWebviewContent(context);
    });
    context.subscriptions.push(startCommand);
}
exports.activate = activate;
function getWebviewContent(context) {
    return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Nimble</title>
	</head>

	<body>
		<div id="root"></div>
		<p>Hello Jackie</p>
		${loadScript(context, 'out.js')}
	</body>
	</html>`;
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map