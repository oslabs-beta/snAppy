import { Position, WorkspaceEdit, ExtensionContext, commands, window, ViewColumn, Uri, workspace } from 'vscode';
import { URI } from 'vscode-uri';
import dynamicImportFunc  from "./dynamicImportFunctions";
const esprima = require('esprima');
const path = require('path');

/*
//traver through the user's workspace and convert static import statements into dynamic imports
originalEntry = path + /src/client/index.js
entryPath = path, but mutates 
*/
export default function traverseUserWorkspace (originalEntry: string, entryPath: string) {
    console.log('orig path(param)', originalEntry);    
    console.log('entry path(param)', entryPath);
        
        //read the file
    let readURI: any = URI.file(entryPath);
    workspace.fs.readFile(readURI)
        .then((res: any) => {

            let holdingRes = res.toString();
            let result = parseAST(esprima.parseModule(res.toString(), { tolerant: true, range: true, loc: true, jsx: true }));
            
            let newResults: any = findComponentsInFile(result.components, holdingRes, result.paths, result.importLineNumbers);
            if (entryPath !== originalEntry && newResults.importLineNumbers.length) {
                dynamicImportFunc(readURI,newResults.importLineNumbers, result.exportLineNumber, newResults.components);
            }
            
            //iterating through paths array to traverse through user's components 
            if (newResults.paths.length > 0) {

                //loop through the paths array  
                //building the paths to traverse through the workspace 
                //resetting the traverse path and move to the 
                for (let i=0; i<result.paths.length; i+=1) {
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
                    
                    traverseUserWorkspace(originalEntry, resolvedPath + '.jsx');
                }
            } 
        }); 
    }

 function parseAST(astObj: any) {
        console.log('entered~ astobj:', astObj);
        interface ImportObj {
          name: string;
          source: string;
          path: string;
          range?: number[];
          line?: number;
        }
        
        interface ResultObj {
          paths: Array<string>;
          components: any;
          exportLineNumber: number;
          importLineNumbers: number[];
          otherImports: any;
        }
      
        let resultObj: ResultObj = {
          paths:[],
           components:{},
             exportLineNumber:0,
              importLineNumbers:[],
               otherImports:{}
        };

        for (let i=0; i<astObj.body.length; i+=1) {
          let regex = /\//g;
      
          //Checking the import statments to find paths to dynamically import
          if (astObj.body[i].type === 'ImportDeclaration') {
            //if the current statement includes a child component import;
            let componentObj: ImportObj = {name : '', source: '', path: ''};
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
              } else if (astObj.body[i].source.value){
                //otherwise, it is other import statements
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
      
function findComponentsInFile (componentsObj: any, stringifiedResult: string, pathsArray: Array<string>, importLineNumbers: Array<number>) {
    let newResultObj: any = {};
    let componentNames = Object.keys(componentsObj);
    for (let i=0; i<componentNames.length; i+=1) {
        let currentName = componentNames[i];
        let searchName = '<' + currentName;
        //use regex to find component names
        let regex = new RegExp (searchName, 'g');
        //logic to delete the irrelevant components from the resultObject
        //search name is the regex, 
        if (!stringifiedResult.match(regex)) {
            delete componentsObj[currentName];
            //what is being removed (index) = i
            pathsArray.splice(i,1);
            importLineNumbers.splice(i,1);
        }
    }
    newResultObj.components = componentsObj;
    newResultObj.paths = pathsArray;
    newResultObj.importLineNumbers = importLineNumbers;
    return newResultObj;
}
