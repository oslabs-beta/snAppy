import * as React from 'react';
import {loadLiquidFillGauge, liquidFillGaugeDefaultSettings} from '../../../functions/loadLiquidGauge';

const LiquidGauges: React.FC = () => {
    React.useEffect(()=>{
        loadLiquidFillGauge("fillgauge1",60.44, liquidFillGaugeDefaultSettings());
        // var config4 = liquidFillGaugeDefaultSettings();
        // config4.circleThickness = 0.15;
        // config4.circleColor = "#808015";
        // config4.textColor = "#555500";
        // config4.waveTextColor = "#FFFFAA";
        // config4.waveColor = "#AAAA39";
        // config4.textVertPosition = 0.8;
        // config4.waveAnimateTime = 1000;
        // config4.waveHeight = 0.05;
        // config4.waveAnimate = true;
        // config4.waveRise = false;
        // config4.waveHeightScaling = false;
        // config4.waveOffset = 0.25;
        // config4.textSize = 0.75;
        // config4.waveCount = 3;
        // loadLiquidFillGauge("fillgauge5", 60.44, config4);
    });

    return <svg id="fillgauge1" width="19%" height="200"></svg>;
};

export default LiquidGauges;