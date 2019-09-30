import {
  Position, WorkspaceEdit, ExtensionContext, commands, window, ViewColumn, Uri, workspace,
} from 'vscode';
import { URI } from 'vscode-uri';
import * as configs from "./functions/webpackFunctions";
import dynamicImportFunc  from "./functions/dynamicImportFunctions";
import traverseUserWorkspace from "./functions/traverseParsingFunctions";
const esprima = require('esprima');
const path = require('path');

//serving the react files
function loadScript(context: ExtensionContext, path: string) {
  let absolutePath = Uri.file(context.asAbsolutePath(path)).with({ scheme: 'vscode-resource' }).toString();
  return "<script src=" + `${absolutePath}` + "></script>";
}

//activating the webview extension command functionality
export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "snAppy" is now active!');
  const startCommand = commands.registerCommand('extension.startSnappy', () => {
    
    //creating the webview panel
    const panel = window.createWebviewPanel('snAppy', 'snAppy!', ViewColumn.Beside, { enableScripts: true });
    panel.webview.html = getWebviewContent(context);
    
    //webview panel front-end event listener
    panel.webview.onDidReceiveMessage((message: any) => {
      //user enters the entryPoint path
      console.log('this is the message.entry: ', message.entry);
      switch (message.command) {
        //button: bundle, build and get stats of app:
        case 'bundle':
          let moduleState: any = {
            entry: message.entry,
            ...message.module,
          };
          
          //run functionality to generate the webpack config file, bundle the developer's app and write the bundles to the dev's workspace
          configs.runWriteWebpackBundle(moduleState, panel);

          break;
        
          //button: optimize
        case 'optimize':
          // console.log('optimizing: parsing thru files and performing opt fx()');
          let resolvedEntry = path.resolve(`${(workspace.workspaceFolders? workspace.workspaceFolders[0].uri.path : '/') + message.entry}`);
          ///src/client/index.js
            traverseUserWorkspace(resolvedEntry, resolvedEntry);
          
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
