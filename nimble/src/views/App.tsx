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
        let CurrentComponent;
        
        const runWebpackGetStats = (message : any) => {
            console.log ("bundling working");
             //lazy load the asset
            //reassign the Component to render <suspnese> <Asset/><suspense>
            //fallback will be the gif
            CurrentComponent = <Assets initialBundleComplete={this.state.initialBundleComplete} initialBundleStats={this.state.initialBundleStats} optFunc = {optimize} entry={this.state.entry} />
            console.log('component bundle',CurrentComponent)
            return vscode.postMessage(message);
        };
         
        const optimize = (message:any)  => {
            console.log("optimizing");
             //lazy load the Visualization
             //reassign the Component to render <suspnese> <Visualization/><suspense>
            //fallback will be the snappy gif
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

        if (this.state.initialBundleComplete === false)
        {
            CurrentComponent =<Form runFunc={runWebpackGetStats} entryFunc = {this.entryHandler} entry={this.state.entry} />
         
        }
        return (
               
            <div id='mainApp'> 
                <h1 id='logoText'>snAppy</h1>
                <br/><br/>
                {CurrentComponent}
            </div>
        );
    }
    
}