import { WorkspaceEdit, workspace, Position, Uri } from "vscode";


export default function dynamicImportFunc(uri: Uri, uncommentLines: number[],exportLine: number, components: ComponentObject) {
  //will use that and the starting position to comment out static imports by using workspaceEdit.insert(URI, position, string)
  let edit = new WorkspaceEdit();
  for (let line of uncommentLines) {
    edit.insert(uri, new Position(line - 1, 0), "//");
  }
  workspace.applyEdit(edit).then(res => {
    console.log("edited", res);
    let dynamicInjection = createDynamicInjection(components);
    insertFunc(uri, exportLine, dynamicInjection);
  });
}
interface EachComponent {
  name: string;
  source: string;
  path: string
}
interface ComponentObject {
[propName: string]: EachComponent
}

const createDynamicInjection = (componentObject: ComponentObject) => {
  //an outside function that loops through the object and for each key will execute the function below to create a new instance of class
  //will have a varibale "injection"  with the class declaration
  let injection = `class DynamicImport extends Component {
    constructor(props) {
      super(props);
      this.state = {
        component: null
      }
    }
    componentDidMount() {
      this.props.load()
        .then((component) => {
          this.setState(()=> ({
            component : component.default ? component.default : component
          }))
      })
    }
    render () {
      return this.props.children(this.state.component)
    }
  }

  `;
  for (let val in componentObject) {
    console.log(componentObject[val].name);
    injection += newInstance(
      componentObject[val].name,
      componentObject[val].source
    );
  }
  //concatenate every new instance of class invoked with each key/values to injection string
  //return the resulting string with injection+ each instance of new class
  return injection;
};
//inside of the outside func there will be a function that injects a string literal with values from the object into string declaration of new instance of DynamicImports class
function newInstance(name: string, path: string) {
  return `const ${name} = (props) => (
    <DynamicImport load= {() => import(/*webpackChunkName: "${name}-chunk"*/ '${path}')}>{
      (Component) => Component === null 
      ? <p>Loading..</p>
      : <Component {...props}/>
    }</DynamicImport>
  )
  `;
}

const insertFunc = (uri: Uri, line: number, injection: string) => {
  console.log("inject", injection);
  console.log("line", line);
  let edit = new WorkspaceEdit();
  edit.insert(uri, new Position(line - 1, 0), injection);
  // .then(res => console.log('is it inserting?', res))
  workspace.applyEdit(edit).then(res => console.log("applyedit", res));
};
