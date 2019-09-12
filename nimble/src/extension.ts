import * as vscode from 'vscode';
import {URI} from 'vscode-uri';
const path = require('path');

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "nimble" is now active!');
	let startCommand = vscode.commands.registerCommand('extension.startNimble', () => {
		
		const panel = vscode.window.createWebviewPanel('nimble', 'Nimble', vscode.ViewColumn.Beside, 
		{
			enableScripts: true,
		});
	panel.webview.html = getWebviewContent();
	});
	context.subscriptions.push(startCommand);
}

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
	</html>`
}

function getNonce() {
	let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export function deactivate() {}