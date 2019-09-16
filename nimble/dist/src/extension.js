"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as vscode from 'vscode';
var vscode_1 = require("vscode");
// import {URI} from 'vscode-uri';
// const path = require('path');
//this is the new code we copied from aliens
var path = require("path");
function loadScript(context, path) {
    return "<script src=\"" + vscode_1.Uri.file(context.asAbsolutePath(path)).with({ scheme: 'vscode-resource' }).toString() + "\"></script>";
}
function activate(context) {
    console.log('Congratulations, your extension "nimble" is now active!');
    var startCommand = vscode_1.commands.registerCommand('extension.startNimble', function () {
        var panel = vscode_1.window.createWebviewPanel('nimble', 'Nimble', vscode_1.ViewColumn.Beside, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [vscode_1.Uri.file(path.join(context.extensionPath, 'dist'))]
        });
        panel.webview.html = getWebviewContent(context);
    });
    context.subscriptions.push(startCommand);
}
exports.activate = activate;
function getWebviewContent(context) {
    // const nonce = getNonce();
    return "<!DOCTYPE html>\n\t<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"UTF-8\">\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n\t\t\n\t\t<title>Nimble</title>\n\t</head>\n\t<body>\n\t\t<div id=\"root\"></div>\n\t\t<p>Hello Jackie</p>\n\t\t" + loadScript(context, '../nimble/dist/out/index.js') + "\n\t</body>\n\t</html>";
}
// function getNonce() {
// 	let text = '';
//     const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     for (let i = 0; i < 32; i++) {
// 		text += possible.charAt(Math.floor(Math.random() * possible.length));
//     }
//     return text;
// }
function deactivate() { }
exports.deactivate = deactivate;
//<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';">
// nonce="${nonce}"
//# sourceMappingURL=extension.js.map