import * as React from 'react';
import Form from './components/Form';
import '../style/styles.css';
import Assets from './components/Assets';

// interface set for class; set type to void because function does not return a value;
interface Vscode {
    postMessage(message: any): void;
}

declare const vscode: Vscode;


interface Asset {
    name: string;
    size: number;
    chunks: number[];
    chunkNames: string[];
}

interface State {
    initialBundleComplete: boolean;
    initialBundleStats?: Asset[];
    entry: string;
}

export default class App extends React.Component<{},State> {
    constructor(props: any) {
        super(props);
        this.state= {
            initialBundleComplete: false,
            initialBundleStats: undefined,
            entry: '',
        };
        this.entryHandler = this.entryHandler.bind(this);
    }
    entryHandler = (event: any) =>  {
        // event.preventdefault();
        console.log('entry: ', this.state.entry);
        this.setState({entry: event.target.value});
    }
    render() {
    
        const runWebpackGetStats = (message : any) => {
            console.log ("bundling working");
            return vscode.postMessage(message);
        };

        const optimize = (message:any)  => {
            console.log("optimizing");
            return vscode.postMessage(message);
        };
        
        window.addEventListener('message', event => {
            // console.log(event.data)
            const message: any = (event.data);
            console.log(JSON.parse(message.field));
            let assetObj: Asset[] = JSON.parse(message.field).assets;
            console.log('message recieved', assetObj);
            this.setState ({
                initialBundleComplete: true,
                initialBundleStats: assetObj
            }); 
        });     
        return (
               
            <div id='mainApp'> 
                <h1 id='logoText'>snAppy</h1>
                <br/><br/>
                 <Form runFunc={runWebpackGetStats} entryFunc = {this.entryHandler} entry={this.state.entry} />
                 <Assets initialBundleComplete={this.state.initialBundleComplete} initialBundleStats={this.state.initialBundleStats} optFunc = {optimize} entry={this.state.entry} />
                
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
