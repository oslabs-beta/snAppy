import * as React from 'react';
import Form from './components/Form';
import '../style/styles.css';
import Assets from './components/Assets';
import Visualizations from './components/Visualizations';

//const Assets: any = React.lazy(() => import ('./components/Assets'));
//const Visualizations: any = React.lazy(() => import ('./components/Visualizations'))

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
    bundleButtonClicked : boolean;
    entry: string;
    optimizeButtonClicked: boolean;
    postBundleComplete: boolean;
    postBundleStats?: Asset[];
}

export default class App extends React.Component<{},State> {
    constructor(props: any) {
        super(props);
        this.state= {
            initialBundleComplete: false,
            initialBundleStats: undefined,
            bundleButtonClicked: false,
            entry: '',
            optimizeButtonClicked: false,
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
            this.setState({bundleButtonClicked: true})
            console.log("clicked", this.state.bundleButtonClicked)
            return vscode.postMessage(message);
        };
         
        const optimize = (message:any)  => {
            console.log("optimizing");
            this.setState({optimizeButtonClicked: true})
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
                    break;
                case 'post':
                    let postStats: Asset[] = JSON.parse(message.field).assets;
                    this.setState({
                        postBundleComplete: true,
                        postBundleStats: postStats
                    })
             }   
        });    

        if (this.state.initialBundleComplete === false)
        {
            CurrentComponent =<Form runFunc={runWebpackGetStats} entryFunc = {this.entryHandler} entry={this.state.entry} />
         
        }
        if (this.state.bundleButtonClicked) {
            CurrentComponent= <div><img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" /> <br></br>
            Caaaat Cooooding!</div>
        }
        if (this.state.initialBundleComplete && this.state.initialBundleStats) {
            CurrentComponent = 
            <div>
            <Assets initialBundleStats={this.state.initialBundleStats} optFunc = {optimize} entry={this.state.entry} />
            </div>
        }
        if (this.state.optimizeButtonClicked) {
            CurrentComponent = <div>
            <img src="https://cdn.dribbble.com/users/2063732/screenshots/6330750/untitled-1.gif" width="300" id= "snap"/>
            </div>
        }
        if (this.state.postBundleComplete && this.state.postBundleStats) {
            CurrentComponent = 
            <div>
            <Visualizations/>
            </div>
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