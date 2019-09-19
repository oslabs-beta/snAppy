import * as React from 'react';

interface Asset {
    name: string;
    size: number;
    chunks: number[];
    chunkNames: string[];
}

interface Props {
    recievedMessage:boolean;
    messageField?: Asset[];
}

export default class Assets extends React.Component<Props,{}> {

    constructor(props: any) {
        super(props);
    }


    render() {
        const {recievedMessage, messageField} = this.props;

        if(recievedMessage && messageField){
            return(<>
            <h4>Bundled Asset(s):  Size</h4>
            {messageField.map((asset:Asset)=><div>{`${asset.name}: ${asset.size} KiB`}</div>)}
            <button>Remove Dupes</button>
            <button>Lazy-load</button>
            <button>Export Files</button>
            </>);
        } else {return(
            <div>

            </div>
        );
    }
    }




}