/*
    this is the pseudocode to implement for later functionality in regards to creating/automating the bundling process for the user - including creating the webpack.config.js
        who: the developer/user who will be using our vscode extension/webview;
        what: this will be their webpack.config.js
        where: it will be stored in our backend, but because we will be utilizing child process, we can run    the bundling for them
        how: front-end will have a checklist of dependencies/laoders, etc... given them, we will create the object for them
        why: so that any one user will be able to use this tool because we won't depend/assume that they have webpack (in the event they don't have it bundled, or using another bundler); added bonus: we bundle it for them!
    
*/

/*webpack generator:
    based on front-end checklist, we can convert their inputs/buttons as an obj: 
        inputNeeded: {
            mode: (1)input form,
            entry: (1-2)input forms - name, optional: URI, or we can automate this;
            output: (1-2)input forms - name, optional: URI, or we can automate this;
        }
        rulesOfModuleNeeded: {
            test: input form
            use: (1) input form - array of loaders || (4 optional)input forms - loader, options, presets, exclude
        }
*/

const createWebpackConfig = (modules) => {
    const moduleExports = {};
    moduleExports.mode = `mode they've selected: development || production`;
    moduleExports.entry = {
        nameOfWhatTheyInputInForm: `their uri (either by input form, or by our automation using vscode.workspace.workFolders)`
    }
    moduleExports.output = {
        filename: `bundle.js`,
        path: `uri to output to, given in input form`
    }
    moduleExports.module = modules;
    return moduleExports;
}
/*create obj for module configs:
    front-end: checklist should include -> modules they wish to include and rules form --> test, use, exclude, etc. 
*/
const createModule = (takesInArgsFromFEOptions) => {
    //rules for loaders, parsers, etc:
    const module = {
        rules = []
    }
    const ruleObj = {
        test: `string input from f/e`,
        use: [`strings(loaders) from f/e`] || {
            loader: `string from f/e`,
            options: {
            presets: [`presets from f/e`],
          },
        },  
    }
    return module;
}


/*
We can use vscode.workspace API to read/write their workspace and give them this config file;
After webpack.config is generated in their workspace, we can now run from our back-end the child process to bundle their app;
*/