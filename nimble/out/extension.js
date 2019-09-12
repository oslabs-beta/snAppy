"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require('path');
function activate(context) {
    console.log('Congratulations, your extension "nimble" is now active!');
    let startCommand = vscode.commands.registerCommand('extension.startNimble', () => {
        const panel = vscode.window.createWebviewPanel('nimble', 'Nimble', vscode.ViewColumn.Beside, {
            enableScripts: true,
        });
        panel.webview.html = getWebviewContent();
    });
    context.subscriptions.push(startCommand);
}
exports.activate = activate;
function getWebviewContent() {
    const nonce = getNonce();
    return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';">
		<title>Nimble</title>
	</head>
	<body>
	<script nonce="${nonce}">
	const vscode = acquireVsCodeApi();
	</script>
	</body>
	</html>`;
}
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map