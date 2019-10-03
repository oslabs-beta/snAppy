"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const vscode_uri_1 = require("vscode-uri");
const optimizeFunctions_1 = require("./optimizeFunctions");
const esprima = require('esprima');
const path = require('path');
function traverseAndDynamicallyImport(originalEntry, entryPath) {
    let readURI = vscode_uri_1.URI.file(entryPath);
    vscode_1.workspace.fs.readFile(readURI)
        .then((res) => {
        let holdingRes = res.toString();
        let result = parseAST(esprima.parseModule(res.toString(), { tolerant: true, range: true, loc: true, jsx: true }));
        let newResults = findComponentsInFile(result.components, holdingRes, result.paths, result.importLineNumbers);
        if (entryPath !== originalEntry && newResults.importLineNumbers.length) {
            optimizeFunctions_1.default(readURI, newResults.importLineNumbers, result.exportLineNumber, newResults.components);
        }
        if (newResults.paths.length > 0) {
            for (let i = 0; i < result.paths.length; i += 1) {
                let currentPath = result.paths[i];
                const originalSplitEntry = entryPath.split(path.sep);
                const currentSplitArr = currentPath.split('/');
                let counter = 1;
                for (let j = 0; j <= currentSplitArr.length - 1; j++) {
                    if (currentSplitArr[j] === '.') {
                        originalSplitEntry.pop();
                        currentSplitArr.splice(j, 1);
                    }
                    if (currentSplitArr[j] === '..') {
                        counter++;
                    }
                }
                if (counter !== 1) {
                    currentSplitArr.splice(0, counter - 1);
                    originalSplitEntry.splice(originalSplitEntry.length - counter);
                }
                let joinOriginalArr = [...originalSplitEntry].join('/');
                let joinCurrentArr = [...currentSplitArr].join('/');
                let resolvedPath = path.join(joinOriginalArr, joinCurrentArr);
                traverseAndDynamicallyImport(originalEntry, resolvedPath + '.jsx');
            }
        }
    });
}
exports.default = traverseAndDynamicallyImport;
function parseAST(astObj) {
    let resultObj = {
        paths: [],
        components: {},
        exportLineNumber: 0,
        importLineNumbers: [],
        otherImports: {}
    };
    for (let i = 0; i < astObj.body.length; i += 1) {
        let regex = /\//g;
        //Checking the import statments to find paths to dynamically import
        if (astObj.body[i].type === 'ImportDeclaration') {
            //if the current statement includes a child component import;
            let componentObj = { name: '', source: '', path: '' };
            if (astObj.body[i].specifiers[0] !== undefined) {
                componentObj.name = astObj.body[i].specifiers[0].local.name;
                componentObj.source = astObj.body[i].source.value;
                //check here to see if the import name is in the componentNames array
                if (astObj.body[i].source.value.match(regex)) {
                    //only if it is inside of that array, then we will add the component object to the restlt components obj
                    componentObj.path = astObj.body[i].source.value;
                    resultObj.paths.push(astObj.body[i].source.value);
                    resultObj.components[astObj.body[i].specifiers[0].local.name] = componentObj;
                    resultObj.importLineNumbers.push(astObj.body[i].loc.start.line);
                }
                else if (astObj.body[i].source.value) {
                    //otherwise, it is simple import statements without path to child components
                    resultObj.otherImports[astObj.body[i].source.value] = componentObj;
                }
            }
        }
        //if export...from
        if (astObj.body[i].type === 'ExportDefaultDeclaration') {
            resultObj.exportLineNumber = astObj.body[i].loc.start.line;
        }
    }
    return resultObj;
}
function findComponentsInFile(componentsObj, stringifiedResult, pathsArray, importLineNumbers) {
    let newResultObj = {};
    let componentNames = Object.keys(componentsObj);
    for (let i = 0; i < componentNames.length; i += 1) {
        let currentName = componentNames[i];
        let searchName = '<' + currentName;
        //use regex to find component names
        let regex = new RegExp(searchName, 'g');
        //logic to delete the irrelevant components from the resultObject
        //search name is the regex, 
        if (!stringifiedResult.match(regex)) {
            delete componentsObj[currentName];
            //what is being removed (index) = i
            pathsArray.splice(i, 1);
            importLineNumbers.splice(i, 1);
        }
    }
    newResultObj.components = componentsObj;
    newResultObj.paths = pathsArray;
    newResultObj.importLineNumbers = importLineNumbers;
    return newResultObj;
}
//# sourceMappingURL=traverseParseFunctions.js.map