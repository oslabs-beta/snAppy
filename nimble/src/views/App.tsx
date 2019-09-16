import * as React from 'react';
import Form from './components/Form';

// interface set for class; set type to void because function does not return a value;
interface Vscode {
    postMessage(message: any): void;
}
// declare function acquireVsCodeApi(): vscode;
declare const vscode: Vscode;
function runStats  (task : string) {
    console.log('inside runStats',task);
    return vscode.postMessage({command : task})
}

export default class App extends React.Component {
    render() {
        
        //This is the function that onlick of the submit button, will send the state to the extension.ts file
        const runWebpackGetStats =(message : any) => vscode.postMessage(message);
        //backend will send progress update
        //have an array here that renders the status messages
        
        console.log('hello olga')
        return (
            <div> 
                 {/* will import in the form component here */}
                 <Form runFunc={runWebpackGetStats}  />
                <button onClick={()=>runStats('stats')}>click</button>

            </div>
        );
    }
}


// Outline for components

//app:
    //contain the Form and the submit functionality

//Module Selection Components:
    //a toggle button with some text
    //will have a true or false flag

/*object = {
    Command: 'config',
    Field: {
        entry: 'string',
        module: {
            jsx: true,
            css: true,
            sass: true,
        }
    }

}*/