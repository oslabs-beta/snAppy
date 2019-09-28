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
    postBundleComplete: boolean,
    postBundleStats?: Asset[]
}

export default class App extends React.Component<{},State> {
    constructor(props: any) {
        super(props);
        this.state= {
            initialBundleComplete: false,
            initialBundleStats: undefined,
            entry: '',
            postBundleComplete: false,
            postBundleStats: undefined
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
            //change the component to render <suspnese> <Asset/><suspense>
            //fallback will be the gif
            //lazy load the asset
            return vscode.postMessage(message);
        };

        const optimize = (message:any)  => {
            console.log("optimizing");
            return vscode.postMessage(message);
        };
        
        window.addEventListener('message', event => {
            // console.log(event.data)
            const message: any = (event.data);
            switch (message.command) {
                case 'initial':
                    console.log(JSON.parse(message.field));
                    let initialStats: Asset[] = JSON.parse(message.field).assets;
                    console.log('message recieved', initialStats);
                    this.setState ({
                        initialBundleComplete: true,
                        initialBundleStats: initialStats
                    }); 
             }   
        });    
       //will create if/switch statement to conditionally render either default Form
       // when initial bundle state are complete change the state to bundlinfg to true 
       //and then the case bundled true with load the Suspense compoent with gif and lazy load of the asssets containifn the bundled stats 

        return (
               
            <div id='mainApp'> 
                <h1 id='logoText'>snAppy</h1>
                <br/><br/>
                {component}
                 {/* <Form runFunc={runWebpackGetStats} entryFunc = {this.entryHandler} entry={this.state.entry} />
                 <Assets initialBundleComplete={this.state.initialBundleComplete} initialBundleStats={this.state.initialBundleStats} optFunc = {optimize} entry={this.state.entry} /> */}
                
            </div>
        );
    }
    
}