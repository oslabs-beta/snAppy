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
            // console.log("optimizing");
            return vscode.postMessage(message);
        };

        //backend will send progress update
        //have an array here that renders the status messages
        window.addEventListener('message', event => {

            const message: any = (event.data);
            // console.log(JSON.parse(message.field));
            let assetObj: Asset[] = JSON.parse(message.field).assets;
            // console.log('message recieved', assetObj);
            this.setState ({
                recievedMessage: true,
                messageField: assetObj
            }); 
        });

        return (
            <div id='mainApp'> 
                <h1 id='logoText'>snAppy</h1>
                <br/><br/>
                 {/* will import in the form component here */}
                 <Form runFunc={runWebpackGetStats} entryFunc = {this.entryHandler} entry={this.state.entry} />
                 <Assets recievedMessage={this.state.recievedMessage} messageField={this.state.messageField} optFunc = {optimize} entry={this.state.entry} />
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


//need to create a path to our visualization using react Router
//import reactRouter
//in the render of the App class - need to have a component called <Router/>
//need to add another element to the state - bunde: true or false
//if true react Route to the component with visualizations
//so react router need to wrapped inside an componenetDidMount inside of the app class snd sdd event listener which listens to the message from the backed when bundling is finished
//and this will setState bundle: true
//in the render () add a conidtional (this.state.bundled) : comp =<visualization/> ? componet