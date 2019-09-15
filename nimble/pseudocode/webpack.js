/*
    this is the pseudocode to implement for later functionality in regards to creating/automating the bundling process for the user - including creating the webpack.config.js
        who: the developer/user who will be using our vscode extension/webview;
        what: this will be their webpack.config.js
        where: it will be stored in our backend, but because we will be utilizing child process, we can run the bundling for them
        how: front-end will have a checklist of dependencies/laoders, etc... given them, we will create the object for them
        why: so that any one user will be able to use this tool because we won't depend/assume that they have webpack (in the event they don't have it bundled, or using another bundler); added bonus: we bundle it for them!
    
*/