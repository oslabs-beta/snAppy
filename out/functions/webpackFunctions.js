"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const vscode_uri_1 = require("vscode-uri");
const util = require("util");
const path = require("path");
const { exec } = require('child_process');
//function creates a webpack config obj based on user inputs and bundles their app;
exports.runWriteWebpackBundle = (moduleStateObj, panel) => {
    //moduleObj is the rules obj returned from reateModule and used in createWebpackConfig
    const moduleObj = createModule(moduleStateObj);
    const webpackConfigObject = createWebpackConfig(`${(vscode_1.workspace.workspaceFolders ? vscode_1.workspace.workspaceFolders[0].uri.path : '/') + moduleStateObj.entry}`, moduleObj);
    //writing a new file called 'webpack.config.js':
    const writeUri = path.join(__dirname, '..', 'webpack.config.js');
    //writing inside the file:
    vscode_1.workspace.fs.writeFile(vscode_uri_1.URI.file(writeUri), new Uint8Array(Buffer.from(`const path = require('path');
              module.exports =${util.inspect(webpackConfigObject, { depth: null })}`, 'utf-8')))
        .then(res => {
        vscode_1.window.showInformationMessage('Bundling...');
        //run child process to execute script:
        return exec('npx webpack --profile --json > compilation-stats.json', { cwd: path.join(__dirname, '..') }, (err, stdout) => {
            //read the file and when complete, send message to frontend
            vscode_1.workspace.fs.readFile(vscode_uri_1.URI.file(path.join(__dirname, '..', 'compilation-stats.json')))
                .then(res => {
                return panel.webview.postMessage({ command: 'initial', field: res.toString() });
            });
        });
    });
};
const createWebpackConfig = (entry, mod) => {
    const moduleExports = {};
    moduleExports.entry = {
        main: entry,
    };
    moduleExports.mode = 'development';
    moduleExports.output = {
        filename: 'bundle.js',
        path: `${(vscode_1.workspace.workspaceFolders ? vscode_1.workspace.workspaceFolders[0].uri.path : '/') + '/dist'}`,
    };
    moduleExports.resolve = {
        extensions: ['.jsx', '.js', '.ts', '.tsx', '.json'],
    };
    moduleExports.module = mod;
    return moduleExports;
};
const createModule = (modules) => {
    const module = {};
    module.rules = [];
    if (modules.css) {
        module.rules.push({
            // keeping regex in string form so that we can pass it to another file
            // we are thinking to convert the string back to a regexpression right before injecting this code into another file
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
        });
    }
    if (modules.jsx) {
        module.rules.push({
            test: /\.(js|jsx)$/,
            use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: ['@babel/plugin-proposal-class-properties']
                    },
                }],
            exclude: '/node_modules/',
        });
    }
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
};
//# sourceMappingURL=webpackFunctions.js.map