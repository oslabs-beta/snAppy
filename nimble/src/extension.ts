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
		let moduleState: string[];

		panel.webview.onDidReceiveMessage(message => {
				switch(message.command) {
					case 'entry':
						console.log('getting entry point');
						//there will only be one entry point
						entryState.push(message.entry);
					case 'module':
						console.log('getting module');
						//there are multiple modules in array
						message.module.forEach((mod: string) => moduleState.push(mod));
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
function createWebpackConfig(entry: string[], mod: any) {
	const moduleExports:any = {};
	moduleExports.entry = {
		main: entry,
	};
	moduleExports.output = {
		filename: 'bundle.js',
		path: workspace.workspaceFile[0].path
	};
	moduleExports.module = mod;
    return moduleExports;
}

function createModule(modules:string[]) {
	const module: any = {};
	module.rules = [];
	const ruleObj: any = {};

}

function createRuleLoaders(modules:string[]) {
	const rules: string[] = [];
	
}
export function deactivate() {}