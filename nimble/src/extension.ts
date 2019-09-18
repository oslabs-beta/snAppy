// import * as vscode from 'vscode';
import {
  ExtensionContext, commands, window, ViewColumn, Uri, workspace,} from 'vscode';
import { URI } from 'vscode-uri';
// node docs;
const { exec } = require('child_process');
// const fs = require('fs');
const util = require('util');


function loadScript(context: ExtensionContext, path: string) {
  return `<script src="${Uri.file(context.asAbsolutePath(path)).with({ scheme: 'vscode-resource' }).toString()}"></script>`;
}

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "nimble" is now active!');
  const startCommand = commands.registerCommand('extension.startNimble', () => {
    const panel = window.createWebviewPanel('nimble', 'Nimble', ViewColumn.Beside, { enableScripts: true });
    panel.webview.html = getWebviewContent(context);

    panel.webview.onDidReceiveMessage((message: any) => {
      let moduleState: any;
      switch (message.command) {
        case 'config':
          moduleState = {
            ...message.module,
          };
          const moduleObj = createModule(moduleState);

          console.log(workspace.workspaceFolders? workspace.workspaceFolders[0]: '/', 'message.entry:', message.entry);
          const webpackConfigObject: any = createWebpackConfig(`${(workspace.workspaceFolders? workspace.workspaceFolders[0].uri.path : '/') + message.entry}`, moduleObj);
          // console.log('this is webpackConfigObject :', webpackConfigObject);


          const writeUri = `${__dirname}/webpack.config.js`;

          workspace.fs.writeFile(URI.file(writeUri), new Uint8Array(Buffer.from(
            `const path = require('path');
            module.exports =${util.inspect(webpackConfigObject, { depth: null })}`, 'utf-8',))) //this is the end of writefile
            .then(res => {
              return exec('npx webpack --profile --json > compilation-stats.json', {cwd: __dirname}, (err : Error, stdout: string)=>{
                console.log('Error in exec: ', err);
                console.log(stdout);
              });
            });

        case 'stats':
          // console.log('getting stats');

        
        case 'dynamic':
          //this is where we start the dynamic load functionality

          //Big ALGO: traversing the files to find import statements
          
          //1. Write a function that takes a path as a parameter
            //the path is the entry point given by the user

            //2. read the file using fs.readFile and save the whole file as a string
            //3. use the Esprima parser to convert the file string into an object
              //pass in the stringified file into the esprima function as an argument
              //return the object with the file contents
            //4. look into object to find import or require statments (callee identifier name)


          //SECOND PART: If an import or require statement is found
            //1. run the dynamic import transformation function here (run it immediately )
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
		<title>Nimble</title>
	</head>

	<body>
	<div id="root"></div>
		<script>
		const vscode = acquireVsCodeApi();
		</script>
		${loadScript(context, 'out/nimble.js')}
	</body>
	</html>`;
}

// webpack config functions:
// entry - message.entry:
function createWebpackConfig(entry: any, mod: any) {
  const moduleExports: any = {};
  moduleExports.entry = {
    main: entry,
  };
  moduleExports.output = {
    filename: 'bundle.js',
    path: `${(workspace.workspaceFolders? workspace.workspaceFolders[0].uri.path : '/') + '/dist'}`,
  };
  moduleExports.resolve = {
    extensions: ['.jsx', '.js', '.ts', '.tsx', '.json'],
  };
  moduleExports.module = mod;
  return moduleExports;
}

// mod: moduleState.mod
function createModule(modules: any) {
  const module: any = {};
  module.rules = [];
  if (modules.css) {
    module.rules.push({
      // keeping regex in string form so that we can pass it to another file
      // we are thinking to convert the string back to a regexpression right before injecting this code into another file
      test: /\.css$/i,
      use: ['style-loader', 'css-loader'],
    });
    // console.log("test key value from module.css obj is", module.rules[0].test);
  }
  if (modules.jsx) {
    module.rules.push({
      test: /\.(js|jsx)$/,
      use: [{
        loader: 'babel-loader',
        options: { presets: ['@babel/preset-env', '@babel/preset-react'] },
      }],
      exclude: '/node_modules/',
    });
  }
  // if statement for modules.tsx
  if (modules.tsx) {
    module.rules.push({
      test: /\.tsx?$/,
      use: ['ts-loader'],
      exclude: '/node_modules/',
		  });
  }
  if (modules.less) {
    module.rules.push({
      test: /\.less$/,
      loader: 'less-loader', // compiles Less to CSS
		  });
  }
  if (modules.sass) {
    module.rules.push({
      test: /\.s[ac]ss$/i,
      use: ['style-loader', 'css-loader', 'sass-loader'],
		  });
  }
  return module;
}

export function deactivate() {}
