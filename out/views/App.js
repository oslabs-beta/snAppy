"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Form_1 = require("./components/Form");
// import '../style/styles.css';
const Assets_1 = require("./components/Assets");
const Visualizations_1 = require("./components/Visualizations");
class App extends React.Component {
    constructor(props) {
        super(props);
        this.entryHandler = (event) => {
            // event.preventdefault();
            console.log('entry: ', this.state.entry);
            this.setState({ entry: event.target.value });
        };
        this.state = {
            initialBundleComplete: false,
            initialBundleStats: undefined,
            bundleButtonClicked: false,
            entry: '',
            optimizeButtonClicked: false,
            postBundleComplete: false,
            postBundleStats: undefined
        };
        this.entryHandler = this.entryHandler.bind(this);
    }
    render() {
        let CurrentComponent;
        const runWebpackGetStats = (message) => {
            console.log("bundling working");
            this.setState({ bundleButtonClicked: true });
            console.log("clicked", this.state.bundleButtonClicked);
            return vscode.postMessage(message);
        };
        const optimize = (message) => {
            console.log("optimizing");
            this.setState({ optimizeButtonClicked: true });
            return vscode.postMessage(message);
        };
        const exportFiles = (message) => {
            console.log('sending to vscode post message with:', message);
            return vscode.postMessage(message);
        };
        window.addEventListener('message', event => {
            // console.log(event.data)
            const message = (event.data);
            switch (message.command) {
                case 'initial':
                    console.log(JSON.parse(message.field));
                    let initialStats = JSON.parse(message.field).assets;
                    console.log('message recieved', initialStats);
                    this.setState({
                        initialBundleComplete: true,
                        initialBundleStats: initialStats
                    });
                    break;
                case 'post':
                    let postStats = JSON.parse(message.field).assets;
                    this.setState({
                        postBundleComplete: true,
                        postBundleStats: postStats
                    });
            }
        });
        if (this.state.initialBundleComplete === false) {
            CurrentComponent = React.createElement(Form_1.default, { runFunc: runWebpackGetStats, entryFunc: this.entryHandler, entry: this.state.entry });
        }
        if (this.state.bundleButtonClicked) {
            CurrentComponent = React.createElement("div", null,
                React.createElement("img", { src: "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif", width: "300" }),
                " ",
                React.createElement("br", null));
        }
        if (this.state.initialBundleComplete && this.state.initialBundleStats) {
            CurrentComponent = React.createElement(Assets_1.default, { initialBundleStats: this.state.initialBundleStats, optFunc: optimize, entry: this.state.entry });
        }
        if (this.state.optimizeButtonClicked) {
            CurrentComponent = React.createElement("div", { className: "image-cropper" },
                React.createElement("img", { src: "https://cdn.dribbble.com/users/2063732/screenshots/6330750/untitled-1.gif", width: "300", id: "snap" }));
        }
        if (this.state.initialBundleStats && this.state.postBundleStats) {
            CurrentComponent = React.createElement(Visualizations_1.default, { initialBundleStats: this.state.initialBundleStats, postBundleStats: this.state.postBundleStats, exportFunc: exportFiles });
        }
        return (React.createElement("div", { id: 'mainApp' },
            React.createElement("h1", { id: 'logoText' }, "snAppy"),
            React.createElement("br", null),
            React.createElement("br", null),
            CurrentComponent));
    }
}
exports.default = App;
//# sourceMappingURL=App.js.map