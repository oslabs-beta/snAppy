import * as React from 'react';
import '../../style/styles.css';

interface State {
    entryPoint: string,
    css: boolean,
    jsx: boolean,
    less: boolean,
    sass: boolean,
    tsx: boolean
    
}

export default class Form extends React.Component<{ runFunc: any},State> {

    constructor(props: any) {
        super(props);
        this.state= {
            entryPoint: "",
            css: false,
            jsx: false,
            less: false,
            sass: false,
            tsx: false
        }

        this.entryHandler = this.entryHandler.bind(this);
        this.cssHandler = this.cssHandler.bind(this);
        this.lessHandler = this.lessHandler.bind(this);
        this.jsxHandler = this.jsxHandler.bind(this);
        this.sassHandler = this.sassHandler.bind(this);
        this.tsxHandler = this.tsxHandler.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
    }

    entryHandler(event: any) {
        // event.preventdefault();
        console.log('entry: ', this.state.entryPoint);
        this.setState({entryPoint: event.target.value})
    }

    cssHandler(event: any) {
        console.log('originalcssState', this.state.css)
        if (this.state.css === false) {
            this.setState({css: true})
            // console.log('css state: ', this.state.css)
        }
        else {
            this.setState({css:false})
            // console.log('css state: ', this.state.css)

        }
    }

    lessHandler(event: any) {
        console.log('less state: ', this.state.less)
        if (this.state.less === false) {
            this.setState({less: true})
            // console.log('less state: ', this.state.less)

        }
        else {
            this.setState({less:false})
            // console.log('less state: ', this.state.less)

        }    
    }

    jsxHandler(event: any) {
        console.log('jsx state: ', this.state.jsx)

        if (this.state.jsx === false) {
            this.setState({jsx: true})
            // console.log('jsx state: ', this.state.jsx)

        }
        else {
            this.setState({jsx:false})
            // console.log('jsx state: ', this.state.jsx)

        }    
    }

    tsxHandler(event: any) {
        console.log('tsx state: ', this.state.tsx)

        if (this.state.tsx === false) {
            this.setState({tsx: true})
            // console.log('tsx state: ', this.state.tsx)

        }
        else {
            this.setState({tsx:false})
            // console.log('tsx state: ', this.state.tsx)
        }    
    }

    sassHandler(event: any) {
        console.log('sass state: ', this.state.sass)
        if (this.state.sass === false) {
            this.setState({sass: true})
            // console.log('sass state: ', this.state.sass)

        }
        else {
            this.setState({sass:false})
            // console.log('sass state: ', this.state.sass)

        }    
    }

    onSubmitForm(event: any) {
        event.preventDefault();
        // this.props.runFunc();
        
        console.log('inside onSubmitFunc')

        const messageObjectToExtension: any = {
            command: 'config',
            entry: this.state.entryPoint,
            module: {
                css: this.state.css,
                jsx: this.state.jsx,
                tsx: this.state.tsx,
                less: this.state.less,
                sass: this.state.sass
            }
        }
        console.log('sending', messageObjectToExtension)
        this.props.runFunc(messageObjectToExtension);
    }


    render() {
        const state = this.state;
        return(
            <div>
                <form onSubmit={this.onSubmitForm}>
                    <label>Entry Point: </label>
                    <input type='text' value={state.entryPoint} onChange={this.entryHandler}/>

                    <br/>
                    <label>Modules: </label><br/>
                    
                    <input type='checkbox' value="css" onChange={this.cssHandler}/>
                    <label>css</label>
                    <input type='checkbox' value="jsx" onChange={this.jsxHandler}/>
                    <label>jsx/js</label>
                    <input type='checkbox' value="less" onChange={this.lessHandler}/>
                    <label>less</label>
                    <input type='checkbox' value="sass" onChange={this.sassHandler}/>
                    <label>sass</label>
                    <input type='checkbox' value="tsx" onChange={this.tsxHandler}/>
                    <label>ts/tsx</label>
                    <br/>
                    <input type='submit' value='Start Optimization!'/>
                </form>

            </div>
        )
    }




}