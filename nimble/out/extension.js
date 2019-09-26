"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const vscode_uri_1 = require("vscode-uri");
const { exec } = require('child_process');
const fs = require('fs');
const util = require('util');
const esprima = require('esprima');
const configs = require("./functions/webpackFunctions");
const optimizeFunctions_1 = require("./functions/optimizeFunctions");
function loadScript(context, path) {
    return `<script src="${vscode_1.Uri.file(context.asAbsolutePath(path)).with({ scheme: 'vscode-resource' }).toString()}"></script>`;
}
function activate(context) {
    console.log('Congratulations, your extension "snAppy" is now active!');
    const startCommand = vscode_1.commands.registerCommand('extension.startSnappy', () => {
        const panel = vscode_1.window.createWebviewPanel('snAppy', 'snAppy!', vscode_1.ViewColumn.Beside, { enableScripts: true });
        panel.webview.html = getWebviewContent(context);
        panel.webview.onDidReceiveMessage((message) => {
            let moduleState;
            switch (message.command) {
                //button: config, build and get stats of app:
                case 'config':
                    moduleState = Object.assign({}, message.module);
                    const moduleObj = configs.createModule(moduleState);
                    // console.log(workspace.workspaceFolders? workspace.workspaceFolders[0]: '/', 'message.entry:', message.entry);
                    const webpackConfigObject = configs.createWebpackConfig(`${(vscode_1.workspace.workspaceFolders ? vscode_1.workspace.workspaceFolders[0].uri.path : '/') + message.entry}`, moduleObj);
                    // console.log('this is webpackConfigObject :', webpackConfigObject);
                    const writeUri = `${__dirname}/webpack.config.js`;
                    vscode_1.workspace.fs.writeFile(vscode_uri_1.URI.file(writeUri), new Uint8Array(Buffer.from(`const path = require('path');            
      
module.exports =${util.inspect(webpackConfigObject, { depth: null })}`, 'utf-8')))
                        .then(res => {
                        vscode_1.window.showInformationMessage('Bundling...');
                        return exec('npx webpack --profile --json > compilation-stats.json', { cwd: __dirname }, (err, stdout) => {
                            // console.log('Error in exec: ', err);
                            // console.log(stdout);
                            vscode_1.workspace.fs.readFile(vscode_uri_1.URI.file(`${__dirname}/compilation-stats.json`))
                                .then(res => {
                                return panel.webview.postMessage({ command: 'stats', field: res.toString() });
                            });
                        });
                    });
                    break;
                case 'optimize':
                    console.log('optimizing: parsing thru files and performing opt fx()');
                    //create a test readFile function from one of the component files (RR container)
                    //once read .then the variable readURI get updated with URI of current file
                    let currURI = vscode_uri_1.URI.file('/Users/lola/Documents/codesmith/soloproject/src/client/containers/RRContainer.jsx');
                    optimizeFunctions_1.default(currURI, [10, 11, 12, 13], 88);
                    console.log("still inside");
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
exports.activate = activate;
function getWebviewContent(context) {
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
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map