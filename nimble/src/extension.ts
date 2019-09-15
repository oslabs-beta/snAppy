// import * as vscode from 'vscode';
import { ExtensionContext, commands, window, ViewColumn, Uri, workspace } from 'vscode';
import * as path from 'path';
import { string, any } from 'prop-types';

function loadScript(context: ExtensionContext, path: string) {
    return `<script src="${Uri.file(context.asAbsolutePath(path)).with({ scheme: 'vscode-resource'}).toString()}"></script>`;
}

export function activate(context: ExtensionContext) {
	console.log('Congratulations, your extension "nimble" is now active!');
	let startCommand = commands.registerCommand('extension.startNimble', () => {
		const panel = window.createWebviewPanel('nimble', 'Nimble', ViewColumn.Beside, {enableScripts: true,});
		panel.webview.html = getWebviewContent(context);	
		
		//check types: front-end should be sending these types back;
		let entryState: string[];
		let moduleState:any = {};

		panel.webview.onDidReceiveMessage(message => {
				switch(message.command) {
					case 'entry':
						console.log('getting entry point');
						//there will only be one entry point
						entryState.push(message.entry);
					case 'module':
						console.log('getting module');
						//copy obj to moduleState.
						moduleState = {
							...message.module
						};
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

//webpack config functions: 
function createWebpackConfig(entry: any, mod: any) {
	const moduleExports:any = {};
	moduleExports.entry = {
		main: entry,
	};
	moduleExports.output = {
		filename: 'bundle.js',
		path: 'workspace.workspaceFile[0].path'
	};
	moduleExports.resolve = {
        extensions: ['.js', '.ts', '.tsx', '.json']
	};
	moduleExports.module = mod;
    return moduleExports;
}

function createModule(modules: any) {
	const module: any = {};
	module.rules = [];
	if (modules.css) {
		module.rules.push({
			test: '/\.css$/i',
			use: ['style-loader', 'css-loader']
		});
	}
	if (modules.jsx) {
		module.rules.push({
			test: '/\.(js|jsx)$/', 
			exclude: '/node_modules/',
			use: [{
				loader: 'babel-loader',
				options: {presets: ['@babel/preset-env', '@babel/preset-react']}
			}]
		});

	}
	return module;
}

let module1 = (createModule({
	css: true,
	jsx: true
}));

console.log(createWebpackConfig('./index.js', module1));

export function deactivate() {}