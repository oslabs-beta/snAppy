"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const LiquidGauges_1 = require("./visuals/LiquidGauges");
class Visualizations extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        function getMainSize(initial, post) {
            //iterate thru initial and post - and only use where nane = 'bundle.js'
            const output = {
                initial: 0,
                post: 0,
                percentDecrease: 0
            };
            for (let obj of initial) {
                if (obj.name === 'bundle.js') {
                    output.initial = obj.size;
                }
            }
            for (let obj of post) {
                if (obj.name === 'bundle.js') {
                    output.post = obj.size;
                }
            }
            output.percentDecrease = Math.ceil(((output.initial - output.post) / output.initial) * 100);
            console.log('output obj', output);
            return output;
        }
        let mainBundle = getMainSize(this.props.initialBundleStats, this.props.postBundleStats);
        return (React.createElement("div", { id: "stats" },
            React.createElement("h2", null, "Stats:"),
            React.createElement("h3", null, "Before/After of Main Bundle (kiB): "),
            React.createElement(LiquidGauges_1.default, { initialBundleStats: this.props.initialBundleStats, postBundleStats: this.props.postBundleStats }),
            React.createElement("h4", null, `Initial Bundle: ${mainBundle.initial} | Optimized Bundle: ${mainBundle.post}`),
            React.createElement("h1", null,
                mainBundle.percentDecrease,
                "%"),
            React.createElement("h4", null, "decrease from initial bundle to optimized bundle"),
            React.createElement("h3", null, "Assets and Chunks:"),
            React.createElement("div", { id: 'finalBundleResults' }, this.props.postBundleStats.map((asset) => React.createElement("div", null, `${asset.name}: ${asset.size} KiB`))),
            React.createElement("br", null),
            React.createElement("button", { className: 'submitButton', onClick: () => this.props.exportFunc({ command: 'export' }) }, "Export")));
    }
}
exports.default = Visualizations;
//# sourceMappingURL=Visualizations.js.map