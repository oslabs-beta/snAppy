import * as React from 'react';
import {Link} from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

interface Asset {
    name: string;
    size: number;
    chunks: number[];
    chunkNames: string[];
}

interface Props {
    recievedMessage:boolean;
    messageField?: Asset[];
    entry: string;
    optFunc:any;
}

export default class Assets extends React.Component<Props,{}> {

    constructor(props: any) {
        super(props);
    }


    render() {
        const {recievedMessage, messageField} = this.props;

        if(recievedMessage && messageField){
            console.log("received!!")
            return(<>
            <h4>Bundled Asset(s):  Size</h4>
            {messageField.map((asset:Asset)=><div >{`${asset.name}: ${asset.size} KiB`}</div>)}
            <Router>
            <Link to ="/chart"><button /*onClick = {()=> this.props.optFunc({command: 'optimize', entry: this.props.entry})}*/>Optimize</button> </Link>
                <Route path="/chart" component={Chart} />
            </Router>
             </>);
        } else {return(
            <div>
                
            </div>
            
        );
    }
    }




}
const Chart = () => {
    return (
      <div className="nav">
        Hey hey!
      </div>
    )
  }