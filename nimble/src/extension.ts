import {
  Position, WorkspaceEdit, ExtensionContext, commands, window, ViewColumn, Uri, workspace,
} from 'vscode';
import { URI } from 'vscode-uri';
import { string } from 'prop-types';
// node docs;
const { exec } = require('child_process');
const fs = require('fs');
const util = require('util');
const esprima = require('esprima');
import * as configs from "./functions/webpackFunctions";
import dynamicImportFunc  from "./functions/optimizeFunctions";
const path = require('path');


function loadScript(context: ExtensionContext, path: string) {
  return `<script src="${Uri.file(context.asAbsolutePath(path)).with({ scheme: 'vscode-resource' }).toString()}"></script>`;
}

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "snAppy" is now active!');
  const startCommand = commands.registerCommand('extension.startSnappy', () => {
    const panel = window.createWebviewPanel('snAppy', 'snAppy!', ViewColumn.Beside, { enableScripts: true });
    panel.webview.html = getWebviewContent(context);
    
    panel.webview.onDidReceiveMessage((message: any) => {
      
      let entryPointPath: any = message.entry;
      let moduleState: any;
      console.log('this is the message.entry: ', message.entry);
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

                workspace.fs.readFile(URI.file(`${__dirname}/compilation-stats.json`))
                  .then(res => {
                  return  panel.webview.postMessage({command: 'stats', field: res.toString()});
                  });
              });
            });
            break;
        case 'optimize':
          console.log('optimizing: parsing thru files and performing opt fx()');

          ///src/client/index.js
            traverseAndDynamicallyImport(message.entry, message.entry);
            break;
      }
    });
  });
  context.subscriptions.push(startCommand);
}       

function traverseAndDynamicallyImport(originalEntry: string, entryPath: string) {
      console.log('entry path(param)', entryPath);
      //read the file
      let componentPath = `${(workspace.workspaceFolders? workspace.workspaceFolders[0].uri.path : '/') + entryPath}`;
      console.log('comp path:', componentPath);
      let readURI: any = URI.file(componentPath);
      // console.log('readURI:', readURI);
      workspace.fs.readFile(readURI)
        .then((res: any) => {
          // console.log('reading file');
              console.log("the esprima obj after res to string is:", esprima.parseModule(res.toString(), { tolerant: true, range: true, loc: true, jsx: true }));
              let result = parseAST(esprima.parseModule(res.toString(), { tolerant: true, range: true, loc: true, jsx: true }));
              // console.log("this is the result obj from parseAST", result);  

              if (entryPath !== originalEntry) {
                dynamicImportFunc(readURI,result.importLineNumbers, result.exportLineNumber, result.components);

              if (result.paths.length > 0) {
              for (let i=0; i<result.paths.length; i+=1) {
                let currentPath = result.paths[i];
                let regex = /^\.*/;
                currentPath.replace(regex, '');
                traverseAndDynamicallyImport(originalEntry, currentPath);
              }
          } 
        }
      }); 
  }

function parseAST(astObj: any) {
  console.log('entered~ astobj:', astObj);
  interface ImportObj {
    name: string;
    source: string;
    path: string;
    range?: number[];
    line?: number;
  }
  
  interface ResultObj {
    paths: Array<string>;
    components: any;
    exportLineNumber: number;
    importLineNumbers: number[];
    otherImports: any;
  }

  let resultObj: ResultObj = {paths:[], components:{}, exportLineNumber:0, importLineNumbers:[], otherImports:{}};
  
  for (let i=0; i<astObj.body.length; i+=1) {
    let regex = /\//g;
    //"import...from..." statement case
    console.log('i:', i)
    console.log('specifier:', astObj.body[i].specifiers)
    if (astObj.body[i].type === 'ImportDeclaration') {
      //if the current statement includes a child component import;
      let componentObj: ImportObj = {name : '', source: '', path: ''};
      if (astObj.body[i].specifiers[0] !== undefined) {
        componentObj.name = astObj.body[i].specifiers[0].local.name;
        componentObj.source = astObj.body[i].source.value;
        if (astObj.body[i].source.value.match(regex)) {

            componentObj.path = astObj.body[i].source.value;
            resultObj.paths.push(astObj.body[i].source.value);
            resultObj.components[astObj.body[i].specifiers[0].local.name] = componentObj;
            resultObj.importLineNumbers.push(astObj.body[i].loc.start.line);

        } else if (astObj.body[i].source.value){
          resultObj.otherImports[astObj.body[i].source.value] = componentObj;
      }
    }
      //otherwise, it is other import statements
    } 
    //if export...from
    if (astObj.body[i].type === 'ExpressionStatement' && astObj.body[i].expression.left) {
      if (astObj.body[i].expression.left.object.name === "exports") {
        //resultobj: line, 
        resultObj.exportLineNumber = astObj.body[i].loc.start.line;
      }
    } 
  //find Variable Declarations with callee.name === 'require'
} 
return resultObj;
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
