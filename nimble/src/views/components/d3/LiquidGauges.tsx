import * as React from 'react';
import {loadLiquidFillGauge, liquidFillGaugeDefaultSettings} from '../../../functions/loadLiquidGauge';

interface Asset {
    name: string;
    size: number;
}

interface Props {
    initialBundleStats: Asset[];
    postBundleStats: Asset[];
}

const LiquidGauges: React.FC<Props> = (props) => {
    React.useEffect(()=>{
        const config = liquidFillGaugeDefaultSettings();
        config.circleThickness = 0.1;
        config.circleColor = "#3342FF";
        config.textColor = "#6E92F3";
        config.waveTextColor = "#FFFFFF";
        config.waveColor = "#305FDE";
        config.textVertPosition = 0.8;
        config.waveAnimateTime = 1000;
        config.waveHeight = 0.05;
        config.waveAnimate = true;
        config.waveRise = false;
        config.waveHeightScaling = false;
        config.waveOffset = 0.25;
        config.textSize = 0.75;
        config.waveCount = 3;
        if (props.initialBundleStats[0].name === 'bundle.js' || props.postBundleStats[0].name === 'bundle.js') {
            console.log(props.initialBundleStats[0].size, props.postBundleStats[0].size); 
        }  
        loadLiquidFillGauge("fillgauge1",60.44, config);
    });
    return <svg id="fillgauge1" width="19%" height="200"></svg>;
};

export default LiquidGauges;