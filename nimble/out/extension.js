"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as vscode from 'vscode';
const vscode_1 = require("vscode");
const vscode_uri_1 = require("vscode-uri");
// node docs;
const { exec } = require('child_process');
const fs = require('fs');
const util = require('util');
const esprima = require('esprima');
const path = require('path');
function loadScript(context, path) {
    return `<script src="${vscode_1.Uri.file(context.asAbsolutePath(path)).with({ scheme: 'vscode-resource' }).toString()}"></script>`;
}
function activate(context) {
    console.log('Congratulations, your extension "nimble" is now active!');
    const startCommand = vscode_1.commands.registerCommand('extension.startNimble', () => {
        const panel = vscode_1.window.createWebviewPanel('nimble', 'Nimble', vscode_1.ViewColumn.Beside, { enableScripts: true });
        panel.webview.html = getWebviewContent(context);
        panel.webview.onDidReceiveMessage((message) => {
            let entryPointPath = message.entry;
            let moduleState;
            console.log('this is the message.entry: ', message.entry);
            switch (message.command) {
                //button: config, build and get stats of app:
                case 'config':
                    moduleState = Object.assign({}, message.module);
                    const moduleObj = createModule(moduleState);
                    // console.log(workspace.workspaceFolders? workspace.workspaceFolders[0]: '/', 'message.entry:', message.entry);
                    const webpackConfigObject = createWebpackConfig(`${(vscode_1.workspace.workspaceFolders ? vscode_1.workspace.workspaceFolders[0].uri.path : '/') + message.entry}`, moduleObj);
                    // console.log('this is webpackConfigObject :', webpackConfigObject);
                    const writeUri = `${__dirname}/webpack.config.js`;
                    vscode_1.workspace.fs.writeFile(vscode_uri_1.URI.file(writeUri), new Uint8Array(Buffer.from(`const path = require('path');
              module.exports =${util.inspect(webpackConfigObject, { depth: null })}`, 'utf-8')))
                        .then(res => {
                        return exec('npx webpack --profile --json > compilation-stats.json', { cwd: __dirname }, (err, stdout) => {
                            // console.log('Error in exec: ', err);
                            // console.log(stdout);
                            vscode_1.workspace.fs.readFile(vscode_uri_1.URI.file('/Users/courtneykwong/Documents/prod/CJOR/nimble/out/compilation-stats.json'))
                                .then(res => {
                                panel.webview.postMessage({ command: 'stats', field: res.toString() });
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
exports.activate = activate;
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
function traverseAndDynamicallyImport(entryPath) {
    //read the file
    // let componentPath = path.resolve(__dirname, entryPath);
    let readURI = vscode_uri_1.URI.file(entryPath); //userfolderpath/src/client/index.js
    vscode_1.workspace.fs.readFile(readURI)
        .then((res) => {
        // console.log("the esprima obj after res to string is:", esprima.parseModule(res.toString(), { tolerant: true, range: true, loc: true}));
        let result = parseAST(esprima.parseModule(res.toString(), { tolerant: true, range: true, loc: true }));
        console.log("this is the result obj from parseAST", result);
        if (result.paths.length > 0) {
            for (let i = 0; i < result.paths.length; i += 1) {
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
function parseAST(astObj) {
    let resultObj = { paths: [], components: {}, exportLineNumber: 0, importLineNumbers: [], otherImports: {} };
    for (let i = 0; i < astObj.body.length; i += 1) {
        let regex = /\//g;
        //"import...from..." statement case
        if (astObj.body[i].type === 'ImportDeclaration') {
            //if the current statement includes a child component import;
            let componentObj = { name: '', source: '', path: '' };
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
            }
            else if (astObj.body[i].specifiers[0].local.name) {
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
function getWebviewContent(context) {
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
function createWebpackConfig(entry, mod) {
    const moduleExports = {};
    moduleExports.entry = {
        main: entry,
    };
    moduleExports.output = {
        filename: 'bundle.js',
        path: `${(vscode_1.workspace.workspaceFolders ? vscode_1.workspace.workspaceFolders[0].uri.path : '/') + '/dist'}`,
    };
    moduleExports.resolve = {
        extensions: ['.jsx', '.js', '.ts', '.tsx', '.json'],
    };
    moduleExports.module = mod;
    return moduleExports;
}
// mod: moduleState.mod
function createModule(modules) {
    const module = {};
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
            loader: 'less-loader',
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
function optimize(parse) {
    //if it imports browserrouter...
    // if (parse.router) reactRouterDynamicImport(res);
    //if lodash...moments, w/e
    // if (parse.library)libraryDynamicImport(res);
    //if eventListeners,
    // if (parse.events) eventListenersDynamicImport(res);
}
function reactRouterDynamicImport(res) {
    esprima.parseScript(res); //this will return the ast
    //parse: 
}
function libraryDynamicImport(res) {
}
function eventListenersDynamicImport(res) {
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map