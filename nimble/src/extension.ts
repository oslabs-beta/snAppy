// import * as vscode from 'vscode';
import {
  Position, WorkspaceEdit, ExtensionContext, commands, window, ViewColumn, Uri, workspace,
} from 'vscode';
import { URI } from 'vscode-uri';
import { downloadAndUnzipVSCode } from 'vscode-test';
// node docs;
const { exec } = require('child_process');
const fs = require('fs');
const util = require('util');
const esprima = require('esprima');
import * as configs from "./functions/webpackFunctions"
import * as optimize from "./functions/optimizeFunctions"


function loadScript(context: ExtensionContext, path: string) {
  return `<script src="${Uri.file(context.asAbsolutePath(path)).with({ scheme: 'vscode-resource' }).toString()}"></script>`;
}

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "snAppy" is now active!');
  const startCommand = commands.registerCommand('extension.startSnappy', () => {
    const panel = window.createWebviewPanel('snAppy', 'snAppy!', ViewColumn.Beside, { enableScripts: true });
    panel.webview.html = getWebviewContent(context);

    panel.webview.onDidReceiveMessage((message: any) => {
      let moduleState: any;
      switch (message.command) {
        //button: config, build and get stats of app:
        case 'config':
          moduleState = {
            ...message.module,
          };
          const moduleObj = configs.createModule(moduleState);
          // console.log(workspace.workspaceFolders? workspace.workspaceFolders[0]: '/', 'message.entry:', message.entry);
          const webpackConfigObject: any = configs.createWebpackConfig(`${(workspace.workspaceFolders? workspace.workspaceFolders[0].uri.path : '/') + message.entry}`, moduleObj);
          // console.log('this is webpackConfigObject :', webpackConfigObject);
          const writeUri = `${__dirname}/webpack.config.js`;
          workspace.fs.writeFile(URI.file(writeUri), new Uint8Array(Buffer.from(
            `const path = require('path');            
      
module.exports =${util.inspect(webpackConfigObject, { depth: null })}`, 'utf-8',
          )))
            .then(res => {
              window.showInformationMessage('Bundling...');
              return exec('npx webpack --profile --json > compilation-stats.json', {cwd: __dirname}, (err : Error, stdout: string)=>{
                // console.log('Error in exec: ', err);
                // console.log(stdout);
                workspace.fs.readFile(URI.file(`${__dirname}/compilation-stats.json`))
                  .then(res => {
                  return  panel.webview.postMessage({command: 'stats', field: res.toString()});
                  });
              });
            });
            break;
        case 'optimize':
          console.log('optimizing: parsing thru files and performing opt fx()');
            //create a test readFile function from one of the component files (RR container)
            //once read .then the variable readURI get updated with URI of current file
 
            let currURI = URI.file('/Users/courtneykwong/Documents/Codesmith/Projects/soloproject/src/client/containers/RRContainer.jsx');
            optimize.uncommentFunc(currURI,[10,11,12,13])
        
            console.log("still inside")
            // let dynamicInjection = optimize.createDynamicInjection(object);
            // optimize.insertFunc(currURI , 106 , dynamicInjection)
            break;

          /*
            jackie and rachel's parsing algo for folders => ./path that requires opt();
            assuming: the returned files are importing components in an obj
              const toParseObj = {
                    path: path.resolve(__dirname, value),
                    routers: T,   BrowserRouter as Router, Route, Link, Redirect,
                    libraries: T, any imports that's NOT a path or react redux
                    component: {
                      name: 'Weekly',
                      value: './path'
                      }
                    }
                  }
                }
          */
              /*
              create uri from component path given from (importDeclaration.source.value) --> 
              workspace.fs.readFile(path.resolve(__dirname, (importDeclaration.source.value)))
                .then(res => {
                  optimize(res.toString());
                })
              */
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
