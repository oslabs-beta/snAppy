// import * as vscode from 'vscode';
import {
  ExtensionContext, commands, window, ViewColumn, Uri, workspace,
} from 'vscode';
import { URI } from 'vscode-uri';
import { string } from 'prop-types';
// node docs;
const { exec } = require('child_process');
const fs = require('fs');
const util = require('util');
const esprima = require('esprima');
const path = require('path');


function loadScript(context: ExtensionContext, path: string) {
  return `<script src="${Uri.file(context.asAbsolutePath(path)).with({ scheme: 'vscode-resource' }).toString()}"></script>`;
}

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "nimble" is now active!');
  const startCommand = commands.registerCommand('extension.startNimble', () => {
    const panel = window.createWebviewPanel('nimble', 'Nimble', ViewColumn.Beside, { enableScripts: true });
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
          const moduleObj = createModule(moduleState);
          // console.log(workspace.workspaceFolders? workspace.workspaceFolders[0]: '/', 'message.entry:', message.entry);
          const webpackConfigObject: any = createWebpackConfig(`${(workspace.workspaceFolders? workspace.workspaceFolders[0].uri.path : '/') + message.entry}`, moduleObj);
          // console.log('this is webpackConfigObject :', webpackConfigObject);
          const writeUri = `${__dirname}/webpack.config.js`;
          workspace.fs.writeFile(URI.file(writeUri), new Uint8Array(Buffer.from(
            `const path = require('path');
              module.exports =${util.inspect(webpackConfigObject, { depth: null })}`, 'utf-8',
          )))
            .then(res => {
              return exec('npx webpack --profile --json > compilation-stats.json', {cwd: __dirname}, (err : Error, stdout: string)=>{
                // console.log('Error in exec: ', err);
                // console.log(stdout);
                workspace.fs.readFile(URI.file('/Users/courtneykwong/Documents/prod/CJOR/nimble/out/compilation-stats.json'))
                  .then(res => {
                    panel.webview.postMessage({command: 'stats', field: res.toString()});
                  });
              });
            });
        case 'optimize':
          //this is where we start the dynamic load functionality
          traverseAndDynamicallyImport(entryPointPath);
          
          // console.log('optimizing: parsing thru files and performing opt fx()');
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

//Big ALGO: traversing the files to find import statements

          //1. Write a function that takes a path as a parameter
            //the initial path is the entry point given by the user (later on, in the recursive call we will cal this function using the path of the imported components)
            //2. read the file using fs.readFile and save the whole file as a string
            //3. use the Esprima parser to convert the file string into an object
              //pass in the stringified file into the esprima function as an argument
              //return the object with the file contents
            //4. look into object to find import or require statments (callee identifier name)


          //SECOND PART: If an import or require statement is found
            //1. run the dynamic import transformation function here (run it immediately )
          //-------------------------ACTUAL START OF ALGO HERE-----------------------------------
          

function traverseAndDynamicallyImport(entryPath: string) {
      //read the file
      let readURI: any = URI.file(entryPath);//userfolderpath/src/client/index.js
      workspace.fs.readFile(readURI)
      .then((res: any) => {
            console.log("the esprima obj after res to string is:", esprima.parseModule(res.toString(), { tolerant: true, range: true, loc: true}));
         });

      //as we hit the import statement
      //if it is (....child component), then store the path to child component in an array
      //iterate through the array and recursively call traverse function with each element 
      //change entryPointPath= new path (the child component path)
      //otherwise (if it is regular statement), change to dynamic import statement   
             
  }

function parseAST(astObj: any) {
  //this must loop through nested objects
  //look through the body
  // astObj.body = [{first import statement}, {second import statement}]
  
if (// astObj.body[0].type === 'ImportDeclaration';) //different from "const require statement"


// (first import statement)
// astObj.body[0].type === 'ImportDeclaration';
// astObj.body[0].specifiers[0].local.name === 'React';
// asbObj.body[0].source.value: "react"
// asbObj.body[0].range === [0, 26];

// (second import statement)






  //find Expression Statement
  //find Variable Declarations with callee.name === 'require'
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

//assuming we have an obj stringified, we can now parse thru using ast;

function optimize(parse: any) {
  //if it imports browserrouter...
    // if (parse.router) reactRouterDynamicImport(res);
  //if lodash...moments, w/e
    // if (parse.library)libraryDynamicImport(res);
  //if eventListeners,
    // if (parse.events) eventListenersDynamicImport(res);
}
function reactRouterDynamicImport(res: string) {
  esprima.parseScript(res); //this will return the ast
  //parse: 
}

function libraryDynamicImport(res:string) {

}
function eventListenersDynamicImport(res:string) {
}
export function deactivate() {}
