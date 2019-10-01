import { ExtensionContext, commands, window, ViewColumn, Uri, workspace } from 'vscode';
import { URI } from 'vscode-uri';
// node docs;
const { exec } = require('child_process');
import * as configs from "./functions/webpackFunctions";
import traverseAndDynamicallyImport from "./functions/traverseParseFunctions";
const path = require('path');


function loadScript(context: ExtensionContext, path: string) {
  return `<script src="${Uri.file(context.asAbsolutePath(path)).with({ scheme: 'vscode-resource' }).toString()}"></script>`;
}

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "snAppy" is now active!');
  const startCommand = commands.registerCommand('extension.startSnappy', () => {
    const panel = window.createWebviewPanel('snAppy', 'snAppy!', ViewColumn.Beside, { enableScripts: true , retainContextWhenHidden: true});
    panel.webview.html = getWebviewContent(context);
    
    panel.webview.onDidReceiveMessage((message: any) => {

      console.log('this is the message.entry: ', message.entry);
      switch (message.command) {
        //button: config, build and get stats of app:
        case 'config':
          let moduleState: any = {
            entry: message.entry,
            ...message.module,
          };

          configs.runWriteWebpackBundle(moduleState, panel);
          
          break;
        case 'optimize':
          // console.log('optimizing: parsing thru files and performing opt fx()');
          let resolvedEntry = path.resolve(`${(workspace.workspaceFolders? workspace.workspaceFolders[0].uri.path : '/') + message.entry}`);
          ///src/client/index.js
            traverseAndDynamicallyImport(resolvedEntry, resolvedEntry);
            return exec('npx webpack --profile --json > compilation-stats.json', {cwd: __dirname}, (err : Error, stdout: string)=>{

              workspace.fs.readFile(URI.file(path.join(__dirname, '..', 'compilation-stats.json')))
                .then(res => {
                return  panel.webview.postMessage({command: 'post', field: res.toString()});
                });
            });
            break;
      }
    });
  });
  context.subscriptions.push(startCommand);
}       

function getWebviewContent(context: ExtensionContext) {
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


export function deactivate() {}
