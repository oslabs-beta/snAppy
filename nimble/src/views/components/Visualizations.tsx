import * as React from 'react';
import LiquidGauges from './d3/LiquidGauges';

interface Asset {
    name: string;
    size: number;
    chunks: number[];
    chunkNames: string[];
}

interface Props {
    initialBundleStats: Asset[];
    postBundleStats: Asset[];
}

class Visualizations extends React.Component <Props, {}> {
    constructor(props: any) {
        super(props);
    }
    render() {
        return (
            <div>
                <h2>Stats:</h2>
                <h3>Before/After of Main Bundle (kiB) </h3>
                <LiquidGauges initialBundleStats={this.props.initialBundleStats} postBundleStats={this.props.postBundleStats}/>
                <h3>Assets and Chunks:</h3>
                <p>insert chartist bar graph here as a component</p>
            </div>
        );
    }
}

export default Visualizations;