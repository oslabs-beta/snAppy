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

interface MainBundle {
    initial: number;
    post: number;
}

const LiquidGauges: React.FC<Props> = (props) => {
    const [toggle, setToggle] = React.useState(true);
    const [bundle, setBundle] = React.useState({initial:0, post:0});
    const [myGauge, setGauge] = React.useState({update(num:number){console.log(num);}});
    React.useEffect(()=>{
        const config = liquidFillGaugeDefaultSettings();
        const mainBundle = getMainSize(props.initialBundleStats, props.postBundleStats);
        config.maxValue = mainBundle.initial;
        config.circleThickness = 0.05;
        config.circleColor = " #4da6ff";
        config.textColor = "#FFFFFF";
        config.waveTextColor = "#004d99";
        config.waveColor = " #66b3ff";
        config.textVertPosition = 0.8;
        config.waveAnimateTime = 1000;
        config.waveHeight = 0.05;
        config.waveAnimate = true;
        config.waveRise = false;
        config.waveHeightScaling = false;
        config.waveOffset = 0.25;
        config.textSize = 0.75;
        config.waveCount = 3;
        const gauge = loadLiquidFillGauge("fillgauge1",mainBundle.initial, config, mainBundle.post);
        setGauge(gauge);
        setBundle(mainBundle);
    }, []);
    return (
        <svg id="fillgauge1" width="40%" height="40%"  onClick={()=>{
        console.log('on click CLICKED', toggle);
        myGauge.update(toggle ? bundle.post : bundle.initial);
        setToggle(!toggle);}}></svg>
    );
};
function getMainSize(initial: Asset[], post: Asset[]) {
    //iterate thru initial and post - and only use where nane = 'bundle.js'
    let initialN=0;
    let postN = 0;
    for (let obj of initial) {
        if (obj.name === 'bundle.js') {
            initialN = obj.size;
        }
    }
    for (let obj of post) {
        if (obj.name === 'bundle.js') {
            postN = obj.size;
        }
    }
    const mainObjs: MainBundle = { initial: (initialN), post: (postN) };
    console.log('main bundle',mainObjs);
    return mainObjs;
}
export default LiquidGauges;