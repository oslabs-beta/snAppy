import * as React from 'react';

//interface set for class; set type to void because function does not return a value;
interface Vscode {
    postMessage(message: any): void;
}
// declare function acquireVsCodeApi(): vscode;
declare const vscode: Vscode;

const runStats = (task: string) => () => vscode.postMessage({command: task});

export default class App extends React.Component {
    render() {
        return (
            <div>
                <button onClick={runStats('stats')}>click</button>
            </div>
        );
    }
}