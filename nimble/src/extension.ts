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
	function deleteFile(uri:any) {
		console.log('deleting?')
		let theURI = URI.file(uri)
		vscode.workspace.fs.delete(theURI)
	}
	let savedURI = '/Users/courtneykwong/Documents/Codesmith/Projects/samples/vscExt/helloworld/src/delete.html'
	//this is an api function that speaks from ext to webview/recieving and doing sonething after
	panel.webview.onDidReceiveMessage(
		message => {
			switch(message.command) {
				case 'alert':
					deleteFile(savedURI) 
					vscode.window.showInformationMessage(message.text)
					vscode.window.showInformationMessage('is it really tho')

			}
		}
	)
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
	<h2>The Button Element</h2>
	<button id='test'>Use</button>
	
	<script nonce="${nonce}">

	const vscode = acquireVsCodeApi();

	const commandHandler = () => {
		console.log('IM HERE')
		vscode.postMessage({
			command: 'alert',
			text: 'its working!'
		})
	}
	document.querySelector('#test').addEventListener('click', commandHandler);

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