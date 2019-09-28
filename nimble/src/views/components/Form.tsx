import * as React from 'react';
import '../../style/styles.css';

interface State {
    css: boolean;
    jsx: boolean;
    less: boolean;
    sass: boolean;
    tsx: boolean;
}

interface Props {
    runFunc: any;
    entryFunc: any;
    entry: string;
}
export default class Form extends React.Component<Props, State> {

    constructor(props: any) {
        super(props);
        this.state= {
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



    cssHandler(event: any) {
        console.log('originalcssState', this.state.css);
        if (this.state.css === false) {
            this.setState({css: true});
            // console.log('css state: ', this.state.css)
        }
        else {
            this.setState({css:false});
            // console.log('css state: ', this.state.css)

        }
    }

    lessHandler(event: any) {
        console.log('less state: ', this.state.less);
        if (this.state.less === false) {
            this.setState({less: true});
            // console.log('less state: ', this.state.less)

        }
        else {
            this.setState({less:false});
            // console.log('less state: ', this.state.less)

        }    
    }

    jsxHandler(event: any) {
        console.log('jsx state: ', this.state.jsx);

        if (this.state.jsx === false) {
            this.setState({jsx: true});
            // console.log('jsx state: ', this.state.jsx)

        }
        else {
            this.setState({jsx:false});
            // console.log('jsx state: ', this.state.jsx)

        }    
    }

    tsxHandler(event: any) {
        console.log('tsx state: ', this.state.tsx);

        if (this.state.tsx === false) {
            this.setState({tsx: true});
            // console.log('tsx state: ', this.state.tsx)

        }
        else {
            this.setState({tsx:false});
            // console.log('tsx state: ', this.state.tsx)
        }    
    }

    sassHandler(event: any) {
        console.log('sass state: ', this.state.sass);
        if (this.state.sass === false) {
            this.setState({sass: true});
            // console.log('sass state: ', this.state.sass)

        }
        else {
            this.setState({sass:false});
            // console.log('sass state: ', this.state.sass)

        }    
    }

    onSubmitForm(event: any) {
        event.preventDefault();
        // this.props.runFunc();
        
        console.log('inside onSubmitFunc');

        const messageObjectToExtension: any = {
            command: 'bundle',
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
        return(
            <div id='formDiv'>
                <form onSubmit={this.onSubmitForm}>
                    <label id='firstFormLabel'>Entry Point: </label>
                    <input type='text' value={this.props.entry} onChange={this.props.entryFunc}/>

                    <br/>
                    <br/>
                    <label id='firstFormLabel'>Modules: </label><br/><br/>
                    <div id='optionsDiv'>
                        <input type='checkbox' value="css" onChange={this.cssHandler}/>
                        <label id='WPoptionLabel'>css</label>
                        <input type='checkbox' value="jsx" onChange={this.jsxHandler}/>
                        <label id='WPoptionLabel'>jsx/js</label>
                        <input type='checkbox' value="less" onChange={this.lessHandler}/>
                        <label id='WPoptionLabel'>less</label>
                        <input type='checkbox' value="sass" onChange={this.sassHandler}/>
                        <label id='WPoptionLabel'>sass</label>
                        <input type='checkbox' value="tsx" onChange={this.tsxHandler}/>
                        <label id='WPoptionLabel'>ts/tsx</label>
                        <br/><br/>
                    </div>
                        <input id='submitButton'type='submit' value='Bundle!'/>
                    
                </form>

            </div>
        );
    }
}