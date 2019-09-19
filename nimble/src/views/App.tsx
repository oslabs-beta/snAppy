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
}
export default class App extends React.Component<{},State> {
    constructor(props: any) {
        super(props);
        this.state= {
            recievedMessage: false,
            messageField: undefined
        };
    }
    render() {
        
        //This is the function that onlick of the submit button, will send the state to the extension.ts file
        const runWebpackGetStats = (message : any) => {
            console.log ("bundling working");
            return vscode.postMessage(message);
        };
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
                 <Form runFunc={runWebpackGetStats}  />
                 <Assets recievedMessage={this.state.recievedMessage} messageField={this.state.messageField}/>
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