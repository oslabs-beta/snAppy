import * as React from 'react';

interface Asset {
    name: string;
    size: number;
    chunks: number[];
    chunkNames: string[];
}

interface Props {
    initialBundleStats: Asset[];
    entry: string;
    optFunc:any;
}

export default class Assets extends React.Component<Props,{}> {

    constructor(props: any) {
        super(props);
    }


    render() {
        const {initialBundleStats} = this.props;
            return(<>
            <h4>Bundled Asset(s):  Size</h4>
            {initialBundleStats.map((asset:Asset)=><div >{`${asset.name}: ${asset.size} KiB`}</div>)}
            <button onClick = {()=> this.props.optFunc({command: 'optimize', entry: this.props.entry})}>Optimize</button>
            
            </>);
        } 
    };
    
   

