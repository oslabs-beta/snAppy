"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_uri_1 = require("vscode-uri");
const path = require('path');
function activate(context) {
    console.log('Congratulations, your extension "nimble" is now active!');
    let startCommand = vscode.commands.registerCommand('extension.startNimble', () => {
        const panel = vscode.window.createWebviewPanel('nimble', 'Nimble', vscode.ViewColumn.Beside, {
            enableScripts: true,
        });
        panel.webview.html = getWebviewContent();
        function readFile(read, write) {
            console.log('reading?');
            let URIto = vscode_uri_1.URI.file(write);
            let URIfrom = vscode_uri_1.URI.file(read);
            vscode.workspace.fs.readFile(URIfrom)
                .then(res => {
                // console.log(res.toString())
                vscode.workspace.fs.writeFile(URIto, res)
                    .then(data => console.log(data))
                    .then(undefined, error => console.log('writing error:', error));
            })
                .then(undefined, err => console.log('reading error', err));
        }
        let readURI = '/Users/courtneykwong/Documents/Codesmith/Projects/samples/vscExt/helloworld/src/sampleTest.html';
        let writeURI = '/Users/courtneykwong/Documents/Codesmith/Projects/samples/vscExt/helloworld/src/new.html';
        //this is an api function that speaks from ext to webview/recieving and doing sonething after
        panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'alert':
                    readFile(readURI, writeURI);
                    vscode.window.showInformationMessage(message.text);
                    vscode.window.showInformationMessage('is it really tho');
            }
        });
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