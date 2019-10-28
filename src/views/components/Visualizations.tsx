import * as React from 'react';
import LiquidGauges from './visuals/LiquidGauges';
// import '../../style/styles.css'

interface Asset {
    name: string;
    size: number;
    chunks: number[];
    chunkNames: string[];
}

interface Props {
    initialBundleStats: Asset[];
    postBundleStats: Asset[];
    exportFunc: any;
}

interface MainBundle {
    initial: number;
    post: number;
    percentDecrease: number;
}
class Visualizations extends React.Component <Props, {}> {
    constructor(props: any) {
        super(props);
    }
    render() {
        function getMainSize(initial: Asset[], post: Asset[]) {
            //iterate thru initial and post - and only use where nane = 'bundle.js'
            const output: MainBundle = {
                initial: 0,
                post: 0, 
                percentDecrease: 0 
            };
            for (let obj of initial) {
                if (obj.name === 'bundle.js') {
                    output.initial = obj.size;
                }
            }
            
            for (let obj of post) {
                if (obj.name === 'bundle.js') {
                    output.post = obj.size;
                }
            }
            output.percentDecrease = Math.ceil(((output.initial - output.post) / output.initial)* 100);
            console.log('output obj', output);
            return output;
        }
        let mainBundle = getMainSize(this.props.initialBundleStats, this.props.postBundleStats);
        return (
            <div id="stats">
                <h2>Stats:</h2>
                <h3>Before/After of Main Bundle (kiB): </h3>
                <LiquidGauges initialBundleStats={this.props.initialBundleStats} postBundleStats={this.props.postBundleStats}/>
                <h4>{`Initial Bundle: ${mainBundle.initial} | Optimized Bundle: ${mainBundle.post}`}</h4>
                <h1>{mainBundle.percentDecrease}%</h1>
                <h4>decrease from initial bundle to optimized bundle</h4>
                <h3>Assets and Chunks:</h3>
                <div id='finalBundleResults'>
                {this.props.postBundleStats.map((asset:Asset)=><div >{`${asset.name}: ${asset.size} KiB`}</div>)}
                </div>
                <br/>
                <button className='submitButton' onClick={()=> this.props.exportFunc({command:'export'})}>Export</button>
            </div>
        );
    }
}

export default Visualizations;