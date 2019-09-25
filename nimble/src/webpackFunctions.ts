import {workspace} from "vscode";

// webpack config functions:
// entry - message.entry:
export const createWebpackConfig = (entry: any, mod: any) => {
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
      // console.log("test key value from module.css obj is", module.rules[0].test);
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