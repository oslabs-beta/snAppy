/*webpack generator:
    based on front-end checklist, we can convert their inputs/buttons as an obj:
    THOUGHTS HERE:  BUTTONS WITH OUR CHOICES, MIGHT BE EASIER BECAUSE WE CAN HAVE THE FORMAT THE WAY WE WANT, so instead of input form, we would just have buttons to check off and compile it into an array;
        - for example: if we have on our front end
            "please select loaders": O css O .jsx --> this can compile and send to backend as test : ['/\.css$/i', /\.(js|jsx)$/]... etc.
        inputNeeded: {
            mode: buttons,
            entry: (1-2)input forms - name, optional: URI, or we can automate this;
            output: (1-2)input forms - name, optional: URI, or we can automate this;
        }
        rulesOfModuleNeeded: {
            test: buttons
            use: buttons
        }
*/
//webpack config functions: 
function createWebpackConfig(entry, mod) {
    var moduleExports = {};
    moduleExports.entry = {
        main: entry
    };
    moduleExports.output = {
        filename: 'bundle.js',
        path: 'uri'
    };
    moduleExports.resolve = {
        extensions: ['.js', '.ts', '.tsx', '.json']
    };
    moduleExports.module = mod;
    console.log(moduleExports.entry);
    console.log(moduleExports.output);
    console.log(moduleExports.resolve);
    console.log(moduleExports.module.rules);
    console.log(JSON.stringify(moduleExports));
    return moduleExports;
}
function createModule(modules) {
    var module = {};
    module.rules = [];
    if (modules.css) {
        module.rules.push({
            test: '/\.css$/i',
            use: ['style-loader', 'css-loader']
        });
    }
    if (modules.jsx) {
        module.rules.push({
            test: /\.(js|jsx)$/,
            exclude: '/node_modules/',
            use: [{
                    loader: 'babel-loader',
                    options: { presets: ['@babel/preset-env', '@babel/preset-react'] }
                }]
        });
        if (module.less) {
            module.rules.push({
                test: /\.less$/,
                loader: 'less-loader'
            });
        }
        if (module.sass) {
            module.rules.push({
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader']
            });
        }
    }
    return module;
}
var moduState = {
    entry: './path',
    module: {
        css: true,
        jsx: true
    }
};
var modulz = createModule(moduState.module);
console.log(modulz);
console.log(createWebpackConfig(moduState.entry, modulz));
