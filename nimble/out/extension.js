"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as vscode from 'vscode';
const vscode_1 = require("vscode");
//node docs;
const { exec } = require("child_process");
const vscode_uri_1 = require("vscode-uri");
function loadScript(context, path) {
    return `<script src="${vscode_1.Uri.file(context.asAbsolutePath(path))
        .with({ scheme: "vscode-resource" })
        .toString()}"></script>`;
}
function activate(context) {
    console.log('Congratulations, your extension "nimble" is now active!');
    // exec('npx webpack --profile --json > compilation-stats.json', {cwd: __dirname});
    let startCommand = vscode_1.commands.registerCommand("extension.startNimble", () => {
        const panel = vscode_1.window.createWebviewPanel("nimble", "Nimble", vscode_1.ViewColumn.Beside, { enableScripts: true });
        panel.webview.html = getWebviewContent(context);
        panel.webview.onDidReceiveMessage(message => {
            console.log(message.command);
            let moduleState;
            switch (message.command) {
                case "config":
                    console.log("getting input and configuring webpack");
                    console.log("message", message.module);
                    moduleState = Object.assign({}, message.module);
                    // let moduleObj = createModule(moduleState.module);
                    // let webpackConfigObject = createWebpackConfig(moduleState.entry, moduleObj);
                    //console.log(JSON.stringify(webpackConfigObject));
                    //converting the object created using function with inputs from front end
                    //Uint8Array.from - will convert object to to Uint8 array so we can write to a file
                    let readUri = "/Users/courtneykwong/Documents/Codesmith/Projects/soloproject/webpack.config.js";
                    /*the webpack.config file need to be in the root directory but can have a different
                    name as long as specified when using the webpack command
                    write the webpack.config.js into out (__dirname) because childprocess is running in dirr name and webpack is being executed in dirname -> if you don't pass in any arguments, it assumes the file iswebpack.config.js and will be looking for it in the same directory; another way: pass in path to th webpack to whatever config you want to use.s
                  */
                    let writeUri = `${__dirname}/webpack.config.js`;
                    vscode_1.workspace.fs.readFile(vscode_uri_1.URI.file(readUri))
                        .then(res => {
                        console.log('read', res);
                        return vscode_1.workspace.fs.writeFile(vscode_uri_1.URI.file(writeUri), res)
                            .then(res => {
                            console.log('write', res);
                            //exec docs: optional parameter that can show err; stdout: shows detail err in the console;
                            return exec('npx webpack', { cwd: __dirname }, (err, stdout) => {
                                console.log('Error in exec: ', err);
                                console.log(stdout);
                            });
                        });
                    });
                //using workspace.writeFile (path, Uint8 array)
                /*write webpackConfigObject to path: __dirname (refers to where the extension is installed)
                                        .then(res => exec('npx webpack --profile --json > compilation-stats.json', {cwd: __dirname});
                                    */
                case "stats":
                    console.log(__dirname);
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
		<title>Nimble</title>
	</head>

	<body>
	<div id="root"></div>
		<script>
		const vscode = acquireVsCodeApi();
		</script>
		${loadScript(context, "out/nimble.js")}
	</body>
	</html>`;
}
// webpack config functions:
// entry - moduleState.entry:
function createWebpackConfig(entry, mod) {
    const moduleExports = {};
    moduleExports.entry = {
        main: entry
    };
    moduleExports.output = {
        filename: "bundle.js",
        path: "path"
    };
    moduleExports.resolve = {
        extensions: [".js", ".ts", ".tsx", ".json"]
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
            test: /\.css$/i,
            use: ["style-loader", "css-loader"]
        });
    }
    if (modules.jsx) {
        module.rules.push({
            test: /\.(js|jsx)$/,
            use: [
                {
                    loader: "babel-loader",
                    options: { presets: ["@babel/preset-env", "@babel/preset-react"] }
                }
            ],
            exclude: "/node_modules/"
        });
    }
    //if statement for modules.tsx
    if (module.tsx) {
        module.rules.push({
            test: /\.tsx?$/,
            use: ["ts-loader"],
            exclude: /node_modules/
        });
    }
    if (module.less) {
        module.rules.push({
            test: /\.less$/,
            loader: "less-loader" // compiles Less to CSS
        });
    }
    if (module.sass) {
        module.rules.push({
            test: /\.s[ac]ss$/i,
            use: ["style-loader", "css-loader", "sass-loader"]
        });
    }
    return module;
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map