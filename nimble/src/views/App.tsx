import * as React from 'react';
import Form from './components/Form';

//interface set for class; set type to void because function does not return a value;
interface Vscode {
    postMessage(message: any): void;
}
// declare function acquireVsCodeApi(): vscode;
declare const vscode: Vscode;

export default class App extends React.Component {
    render() {
        
        //This is the function that onlick of the submit button, will send the state to the extension.ts file
        const runWebpackGetStats = () => vscode.postMessage;
        const testFunc = () => console.log('hello there')
        
        return (
            <div>
                 {/* will import in the form component here */}
                 <Form runFunc={runWebpackGetStats} test={testFunc}  />
                {/* <button onClick={runWebpackGetStats}>click</button> */}
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