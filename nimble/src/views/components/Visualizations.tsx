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
        // const {initialBundleStats, postBundleStats} = this.props;
        // if (initialBundleStats[0].name === 'bundle.js' || postBundleStats[0].name === 'bundle.js') {
        //     console.log(initialBundleStats[0].size, postBundleStats[0].size); 
        // }
        return (
            <div>
                <LiquidGauges initialBundleStats={this.props.initialBundleStats} postBundleStats={this.props.postBundleStats}/>
            </div>
        );
    }
}

export default Visualizations;