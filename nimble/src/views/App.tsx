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
    recievedMessage: boolean;
    messageField?: Asset[];
    entry: string;
}

export default class App extends React.Component<{},State> {
    constructor(props: any) {
        super(props);
        this.state= {
            recievedMessage: false,
            messageField: undefined,
            entry: '',
            // algoMessage: {
            //     command: 'optimize',
            //     entry: '/Users/MacBong/Desktop/production/CJOR/nimble/out/src/views/components/test.js',
            // }
        };
        this.entryHandler = this.entryHandler.bind(this);
    }
    entryHandler = (event: any) =>  {
        // event.preventdefault();
        console.log('entry: ', this.state.entry);
        this.setState({entry: event.target.value});
    }
    render() {
        
        //This is the function that onlick of the submit button, will send the state to the extension.ts file
        const runWebpackGetStats = (message : any) => {
            console.log ("bundling working");
            return vscode.postMessage(message);
        };

        const optimize = (message:any)  => {
            console.log("optimizing");
            return vscode.postMessage(message);
        };
        // const algoTester = (message : any) => ()=> {
        //     return vscode.postMessage(message);

        // };
        
        //backend will send progress update
        //have an array here that renders the status messages
        window.addEventListener('message', event => {
            // console.log(event.data)
            const message: any = (event.data);
            console.log(JSON.parse(message.field));
            let assetObj: Asset[] = JSON.parse(message.field).assets;
            console.log('message recieved', assetObj);
            this.setState ({
                recievedMessage: true,
                messageField: assetObj
            }); 
        });
        // if (this.state.recievedMessage) {

        // }
        // console.log(this.state)       
        return (
               
            <div id='mainApp'> 
                <h1 id='logoText'>snAppy</h1>
                <br/><br/>
                 {/* will import in the form component here */}
                 <Form runFunc={runWebpackGetStats} entryFunc = {this.entryHandler} entry={this.state.entry} />
                 <Assets recievedMessage={this.state.recievedMessage} messageField={this.state.messageField} optFunc = {optimize} entry={this.state.entry} />
                 {/* <button onClick={algoTester(this.state.algoMessage)}>Test Big Algo</button> */}
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
