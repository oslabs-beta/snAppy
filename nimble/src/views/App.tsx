import * as React from 'react';
import Form from './components/Form';

//interface set for class; set type to void because function does not return a value;
interface Vscode {
    postMessage(message: any): void;
}
// declare function acquireVsCodeApi(): vscode;
declare const vscode: Vscode;

//This is the function that onlick of the submit button, will send the state to the extension.ts file
const runStats = (task: string) => () => vscode.postMessage({command: task});

export default class App extends React.Component {
    render() {
        return (
            <div>
                 {/* will import in the form component here */}
                 <Form runStats={runStats}/>
                <button onClick={runStats('stats')}>click</button>
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
    Command: 'Config',
    Field: {
        entry: 'string',
        module: {
            jsx: true,
            css: true,
            sass: true,
        }
    }

}*/