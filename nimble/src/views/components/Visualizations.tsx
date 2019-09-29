import * as React from 'react';
import LiquidGauges from './d3/LiquidGauges';

class Visualizations extends React.Component {
    render() {
        return (
            <div>
                <LiquidGauges/>
            </div>
        );
    }
}

export default Visualizations;