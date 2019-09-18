// import * as vscode from 'vscode';
import { ExtensionContext, commands, window, ViewColumn, Uri, workspace } from 'vscode';
import {URI} from 'vscode-uri'
//node docs;
const {exec} = require('child_process');
const fs = require('fs');
const util = require('util');


function loadScript(context: ExtensionContext, path: string) {
    return `<script src="${Uri.file(context.asAbsolutePath(path)).with({ scheme: 'vscode-resource'}).toString()}"></script>`;
}

export function activate(context: ExtensionContext) {
	console.log('Congratulations, your extension "nimble" is now active!');
	// exec('npx webpack --profile --json > compilation-stats.json', {cwd: __dirname});
		let startCommand = commands.registerCommand('extension.startNimble', () => {
		const panel = window.createWebviewPanel('nimble', 'Nimble', ViewColumn.Beside, {enableScripts: true,});
		panel.webview.html = getWebviewContent(context);
		
		panel.webview.onDidReceiveMessage((message: any) => {
			console.log('message obj from front end is: ', message);
			let moduleState: any;
				switch(message.command) {
					case 'config':
						moduleState = {
							...message.module
						};
						// console.log('module State is: ', moduleState);
						let moduleObj = createModule(moduleState);
						let utilModuleObj = util.inspect(moduleObj);
						//originally wanted to json parse this object A
						//let A = utilModuleObj

						let webpackConfigObject = createWebpackConfig(message.entry, utilModuleObj);
						
						console.log("this is webpackConfigObject :", webpackConfigObject);


						let writeUri =`${__dirname}/webpack.config.js`;

						workspace.fs.writeFile(URI.file(writeUri), new Uint8Array(Buffer.from(util.inspect(webpackConfigObject), 'utf-8')))
						.then(res => console.log('yayy'));

						console.log('dirname',__dirname);

					case 'stats' :
						console.log('getting stats')
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
	const moduleExports:any = {};
	moduleExports.entry = {
		main: entry,
	};
	moduleExports.output = {
		filename: 'bundle.js',
		path: 'path'
	};
	moduleExports.resolve = {
        extensions: ['.js', '.ts', '.tsx', '.json']
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
			//keeping regex in string form so that we can pass it to another file
			//we are thinking to convert the string back to a regexpression right before injecting this code into another file
			test: /\.css$/i,
			use: ['style-loader', 'css-loader']
		});
		// console.log("test key value from module.css obj is", module.rules[0].test);
	}
	if (modules.jsx) {
		module.rules.push({
			test: /\.(js|jsx)$/, 
			use: [{
				loader: 'babel-loader',
				options: {presets: ['@babel/preset-env', '@babel/preset-react']}
			}],
			exclude: '/node_modules/'
		});
	}
	//if statement for modules.tsx
	if (modules.tsx) {
		module.rules.push({
			test: /\.tsx?$/,
			use: ['ts-loader'],
			exclude: '/node_modules/'
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