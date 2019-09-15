import * as React from 'react';

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