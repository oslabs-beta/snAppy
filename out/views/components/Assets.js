"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class Assets extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { initialBundleStats } = this.props;
        return (React.createElement(React.Fragment, null,
            React.createElement("h4", null, "Bundled Asset(s):  Size"),
            React.createElement("div", { id: 'initialBundleResults' }, initialBundleStats.map((asset) => React.createElement("div", { className: "initalBundle" }, `${asset.name}: ${asset.size} KiB`))),
            React.createElement("br", null),
            React.createElement("button", { className: 'submitButton', onClick: () => this.props.optFunc({ command: 'optimize', entry: this.props.entry }) }, "Optimize")));
    }
}
exports.default = Assets;
//# sourceMappingURL=Assets.js.map