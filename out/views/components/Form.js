"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
require("../../style/styles.css");
class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            css: false,
            jsx: false,
            less: false,
            sass: false,
            tsx: false
        };
        this.cssHandler = this.cssHandler.bind(this);
        this.lessHandler = this.lessHandler.bind(this);
        this.jsxHandler = this.jsxHandler.bind(this);
        this.sassHandler = this.sassHandler.bind(this);
        this.tsxHandler = this.tsxHandler.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
    }
    cssHandler(event) {
        console.log('originalcssState', this.state.css);
        if (this.state.css === false) {
            this.setState({ css: true });
            // console.log('css state: ', this.state.css)
        }
        else {
            this.setState({ css: false });
            // console.log('css state: ', this.state.css)
        }
    }
    lessHandler(event) {
        console.log('less state: ', this.state.less);
        if (this.state.less === false) {
            this.setState({ less: true });
            // console.log('less state: ', this.state.less)
        }
        else {
            this.setState({ less: false });
            // console.log('less state: ', this.state.less)
        }
    }
    jsxHandler(event) {
        console.log('jsx state: ', this.state.jsx);
        if (this.state.jsx === false) {
            this.setState({ jsx: true });
            // console.log('jsx state: ', this.state.jsx)
        }
        else {
            this.setState({ jsx: false });
            // console.log('jsx state: ', this.state.jsx)
        }
    }
    tsxHandler(event) {
        console.log('tsx state: ', this.state.tsx);
        if (this.state.tsx === false) {
            this.setState({ tsx: true });
            // console.log('tsx state: ', this.state.tsx)
        }
        else {
            this.setState({ tsx: false });
            // console.log('tsx state: ', this.state.tsx)
        }
    }
    sassHandler(event) {
        console.log('sass state: ', this.state.sass);
        if (this.state.sass === false) {
            this.setState({ sass: true });
            // console.log('sass state: ', this.state.sass)
        }
        else {
            this.setState({ sass: false });
            // console.log('sass state: ', this.state.sass)
        }
    }
    onSubmitForm(event) {
        event.preventDefault();
        // this.props.runFunc();
        console.log('inside onSubmitFunc');
        const messageObjectToExtension = {
            command: 'config',
            entry: this.props.entry,
            module: {
                css: this.state.css,
                jsx: this.state.jsx,
                tsx: this.state.tsx,
                less: this.state.less,
                sass: this.state.sass
            }
        };
        console.log('sending', messageObjectToExtension);
        this.props.runFunc(messageObjectToExtension);
    }
    render() {
        return (React.createElement("div", { id: 'formDiv' },
            React.createElement("form", { onSubmit: this.onSubmitForm },
                React.createElement("label", { id: 'firstFormLabel' }, "Entry Point: "),
                React.createElement("input", { type: 'text', value: this.props.entry, onChange: this.props.entryFunc }),
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement("label", { id: 'firstFormLabel' }, "Modules: "),
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement("div", { id: 'optionsDiv' },
                    React.createElement("input", { type: 'checkbox', value: "css", onChange: this.cssHandler }),
                    React.createElement("label", { id: 'WPoptionLabel' }, "css"),
                    React.createElement("input", { type: 'checkbox', value: "jsx", onChange: this.jsxHandler }),
                    React.createElement("label", { id: 'WPoptionLabel' }, "jsx/js"),
                    React.createElement("input", { type: 'checkbox', value: "less", onChange: this.lessHandler }),
                    React.createElement("label", { id: 'WPoptionLabel' }, "less"),
                    React.createElement("input", { type: 'checkbox', value: "sass", onChange: this.sassHandler }),
                    React.createElement("label", { id: 'WPoptionLabel' }, "sass"),
                    React.createElement("input", { type: 'checkbox', value: "tsx", onChange: this.tsxHandler }),
                    React.createElement("label", { id: 'WPoptionLabel' }, "ts/tsx"),
                    React.createElement("br", null),
                    React.createElement("br", null)),
                React.createElement("input", { className: 'submitButton', type: 'submit', value: 'Bundle!' }))));
    }
}
exports.default = Form;
//# sourceMappingURL=Form.js.map