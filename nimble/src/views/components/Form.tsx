import * as React from 'react';

interface State {
    entryPoint: string,
    css: boolean,
    jsx: boolean,
    less: boolean,
    sass: boolean,
    tsx: boolean
    
}

export default class Form extends React.Component<{},State> {
    state: State = {
        entryPoint: "",
        css: false,
        jsx: false,
        less: false,
        sass: false,
        tsx: false
    }

    // constructor(props: any) {
    //     super(props);
    //     this.state = {
    //         entryPoint: "",
    //         css: false,
    //         jsx: false,
    //         less: false,
    //         sass: false,
    //         tsx: false
    //     }

    //     this.entryHandler = this.entryHandler.bind(this);
    //     this.cssHandler = this.cssHandler.bind(this);
    //     this.lessHandler = this.lessHandler.bind(this);
    //     this.jsxHandler = this.jsxHandler.bind(this);
    //     this.sassHandler = this.sassHandler.bind(this);
    //     this.tsxHandler = this.tsxHandler.bind(this);
    // }

    entryHandler(event: any) {
        this.setState({entryPoint: event.target.value})
    }

    cssHandler(event: any) {
        this.setState({css: event.target.value})
    }

    lessHandler(event: any) {
        this.setState({less: event.target.value})
    }

    jsxHandler(event: any) {
        this.setState({jsx: event.target.value})
    }

    tsxHandler(event: any) {
        this.setState({tsx: event.target.value})
    }

    sassHandler(event: any) {
        this.setState({sass: event.target.value})
    }


    render() {
        const state = this.state;
        return(
            <div>
                <form onSubmit={this.props.runStats}>
                    <label>Entry Point: </label>
                    <input type='text' value={state.entryPoint} onChange={this.entryHandler}/>
                    <label>Modules: </label><br/>
                    
                    <label>css</label>
                    <input type='radio' value={state.css} onChange={this.cssHandler}/>
                    <label>jsx/js</label>
                    <input type='radio' value={state.jsx} onChange={this.jsxHandler}/>
                    <label>less</label>
                    <input type='radio' value={state.less} onChange={this.lessHandler}/>
                    <label>sass</label>
                    <input type='radio' value={state.sass} onChange={this.sassHandler}/>
                    <label>ts/tsx</label>
                    <input type='radio' value={state.tsx} onChange={this.tsxHandler}/>

                    <input type='submit' value='Start Optimization!'/>
                </form>

            </div>
        )
    }




}