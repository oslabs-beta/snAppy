"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const loadLiquidGauge_1 = require("../../../functions/loadLiquidGauge");
const LiquidGauges = (props) => {
    const [toggle, setToggle] = React.useState(true);
    const [bundle, setBundle] = React.useState({ initial: 0, post: 0 });
    const [myGauge, setGauge] = React.useState({ update(num) { console.log(num); } });
    React.useEffect(() => {
        const config = loadLiquidGauge_1.liquidFillGaugeDefaultSettings();
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
        const gauge = loadLiquidGauge_1.loadLiquidFillGauge("fillgauge1", mainBundle.initial, config, mainBundle.post);
        setGauge(gauge);
        setBundle(mainBundle);
    }, []);
    return (React.createElement("svg", { id: "fillgauge1", width: "40%", height: "40%", onClick: () => {
            console.log('on click CLICKED', toggle);
            myGauge.update(toggle ? bundle.post : bundle.initial);
            setToggle(!toggle);
        } }));
};
function getMainSize(initial, post) {
    //iterate thru initial and post - and only use where nane = 'bundle.js'
    let initialN = 0;
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
    const mainObjs = { initial: (initialN), post: (postN) };
    console.log('main bundle', mainObjs);
    return mainObjs;
}
exports.default = LiquidGauges;
//# sourceMappingURL=LiquidGauges.js.map