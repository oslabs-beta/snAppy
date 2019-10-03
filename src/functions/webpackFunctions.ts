import { window, workspace } from "vscode";
import { URI } from 'vscode-uri';
import util = require('util');
import path = require('path');
const { exec } = require('child_process');

interface ModuleState {
  entry: string | undefined;
  css?: boolean;
  jsx?: boolean;
  less?: boolean;
  sass?: boolean;
  tsx?: boolean
}
export const runWriteWebpackBundle = (moduleStateObj: ModuleState, panel: any ) => {
          const moduleObj = createModule(moduleStateObj);
          const webpackConfigObject: any = createWebpackConfig(`${(workspace.workspaceFolders? workspace.workspaceFolders[0].uri.path : '/') + moduleStateObj.entry}`, moduleObj);
          const writeUri = path.join(__dirname, '..', 'webpack.config.js');
          workspace.fs.writeFile(URI.file(writeUri), new Uint8Array(Buffer.from(
            `const path = require('path');
              module.exports =${util.inspect(webpackConfigObject, { depth: null })}`, 'utf-8',
          )))
            .then(res => {
              window.showInformationMessage('Bundling...');
              return exec('npx webpack --profile --json > compilation-stats.json', {cwd:  path.join(__dirname, '..')}, (err : Error, stdout: string)=>{

                workspace.fs.readFile(URI.file(path.join(__dirname, '..', 'compilation-stats.json')))
                  .then(res => {
                  return  panel.webview.postMessage({command: 'initial', field: res.toString()});
                  });
              });
            });
          };


// webpack config functions:
// entry - message.entry:


export const createWebpackConfig = (entry: string, mod: any) => {
    const moduleExports: any = {};
    moduleExports.entry = {
      main: entry,
    };
    moduleExports.mode = 'development';
    moduleExports.output = {
      filename: 'bundle.js',
      path: `${(workspace.workspaceFolders? workspace.workspaceFolders[0].uri.path : '/') + '/dist'}`,
    };

    moduleExports.resolve = {
      extensions: ['.jsx', '.js', '.ts', '.tsx', '.json'],
    };
    moduleExports.module = mod;
    return moduleExports;
  };
  
  // mod: moduleState.mod
export const createModule = (modules: any) => {
    const module: any = {};
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
  };