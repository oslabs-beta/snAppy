import * as React from 'react';
import LiquidGauges from './visuals/LiquidGauges';
import Donut from './visuals/Donut'

interface Asset {
    name: string;
    size: number;
    chunks: number[];
    chunkNames: string[];
}

interface Props {
    initialBundleStats: Asset[];
    postBundleStats: Asset[];
    exportFunc : any
}

class Visualizations extends React.Component <Props, {}> {
    constructor(props: Props) {
        super(props);
    }
    render() {
        return (
            <div>
                <h2>Stats:</h2>
                <h3>Before/After of Main Bundle (kiB) </h3>
                <LiquidGauges initialBundleStats={this.props.initialBundleStats} postBundleStats={this.props.postBundleStats}/>
                <p>Insert a small visual/graphic for % of decrease</p>
                <h3>Assets and Chunks:</h3>
                <p>insert chartist bar graph here as a component</p>
                <br></br>
                <Donut postBundleStats={this.props.postBundleStats}/>
                <button onClick={()=> this.props.exportFunc({command:'export'})}>Export</button>
            </div>
        );
    }
}

export default Visualizations;
