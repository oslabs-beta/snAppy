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
import * as configs from "./functions/webpackFunctions"
import dynamicImportFunc  from "./functions/optimizeFunctions"
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
 
            let currURI = URI.file('/Users/lola/Documents/codesmith/soloproject/src/client/containers/RRContainer.jsx');
            dynamicImportFunc(currURI,[10,11,12,13],88)
        
            console.log("still inside")
            // let dynamicInjection = optimize.createDynamicInjection(object);
            // optimize.insertFunc(currURI , 106 , dynamicInjection)
            break;

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
      // let componentPath = path.resolve(__dirname, entryPath);
      let readURI: any = URI.file(entryPath);//userfolderpath/src/client/index.js
      workspace.fs.readFile(readURI)
      .then((res: any) => {
            // console.log("the esprima obj after res to string is:", esprima.parseModule(res.toString(), { tolerant: true, range: true, loc: true}));
            let result = parseAST(esprima.parseModule(res.toString(), { tolerant: true, range: true, loc: true}));
            console.log("this is the result obj from parseAST", result);  
            if (result.paths.length > 0) {
            for (let i=0; i<result.paths.length; i+=1) {
              let currentPath = result.paths[i];
              let regex = /^\.*/;
              currentPath.replace(regex, '');
              traverseAndDynamicallyImport(currentPath);
            }
          }
            //iterate through the path array and recursively call traverse function with each element 
            //if it is (....child component), then store the path to child component in an array
            //change entryPointPath= new path (the child component path)
            //otherwise (if it is regular statement), change to dynamic import statement   
      }); 
  }

function parseAST(astObj: any) {
  interface ComponentObj {
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
    if (astObj.body[i].type === 'ImportDeclaration') {
      //if the current statement includes a child component import;
      let componentObj: ComponentObj = {name : '', source: '', path: ''};
      componentObj.name = astObj.body[i].specifiers[0].local.name;
      componentObj.source = astObj.body[i].source.value;
      // componentObj.range = astObj.body[i].range; 
      if (astObj.body[i].source.value.match(regex)) {
        // componentObj.line = astObj.body[i].loc.start.line;
        
        componentObj.path = astObj.body[i].source.value;
        //push the path into the paths array
        resultObj.paths.push(astObj.body[i].source.value);
        //and add the components object to the components key object
        resultObj.components[astObj.body[i].specifiers[0].local.name] = componentObj;
        
        //we have to reset the uri path for the next file to read, set it to source.value
        //call the function with the new uri path
      } else if (astObj.body[i].specifiers[0].local.name) {
        resultObj.otherImports[astObj.body[i].source.value] = componentObj;
      }
      //otherwise, it is other import statements
      resultObj.importLineNumbers.push(astObj.body[i].loc.start.line);
    } 
    //if export...from
    if (astObj.body[i].type === 'ExpressionStatement') {
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
