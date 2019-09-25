// import { Component } from "react";

//create a class DynamicImports() and inside we will create State ={component:null}
//add life-cycle method componentDidMount() and inside of it we will declare a props.load which is a method that returns a thenable and inside there we will setState() to initital state(component=null)
// class DynamicImport extends Component {
//   state = {
//     component: null
//   };
//   componentDidMount() {
//     this.props.load().then(component => {
//       this.setState(() => ({
//         component: component.default ? component.default : component
//       }));
//     });
//   }
//   render() {
   //props.children is used to display whatever is included between the opening and closing carrtos, whenever you invoke a components
  //abstracts all children of the component into a regular div, allowing us to dynamically render elements
  //each instance will dictate which elements should be dynamically rendered
//     return this.props.children(this.state.component);
//   }
// }
//creates and instance that dictates which elements will be rendered based on the compo
//in this instance of our component we are going to return a DynamicImport component which wraps our component in the DynamicImport component it has a load method declaration with the path of the component we want to import
//if the component has been already been rendered on the DOM, then we just load it, since its already been fully loaded from the path
//if the component is not loaded on the DOM , we will render a <p>Loading,p>  tag, and because we are changing the DOM the ComponentDidMount get triggered its executing the props.load method which imports our actual component
//once the promise is resolved and the state is chnaged the render displays the element wihthin the component through props.children
// const ourComponent = props => (
//   <DynamicImport load={() => import(/*${name}-chunk*/"./ourComponentPath")}>
//     {Component =>
//       Component === null ? <p>Loading..</p> : <Component {...props} />
//     }
//   </DynamicImport>
// );

//given our object of components from AST , each key is a differnet component and each value is an object with name , path, range array
//iterate forEach key we will create an instance of dynamicImport class using its values(obj.values)
function createDynamicInjection (componentObject) {
//an outside function that loops through the object and for each key will execute the function below to create a new instance of class
//will have a varibale "injection"  with the class declaration
let injection = `class DynamicImport extends Component {
  state = {
    component: null
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
`
  for (let val in componentObject) {
    console.log(componentObject[val].name)
    injection += newInstance(componentObject[val].name, componentObject[val].path)
  }
//concatenate every new instance of class invoked with each key/values to injection string
//return the resulting string with injection+ each instance of new class
  return injection
}
//inside of the outside func there will be a function that injects a string literal with values from the object into string declaration of new instance of DynamicImports class
function newInstance(name, path) {
  return `const ${name} = (props) => (
  <DynamicImport load= {() => import(/*wepbackChunkName: "${name}-chunk"*/ '${path}')}>{
    (Component) => Component === null 
    ? <p>Loading..</p>
    : <Component {...props}/>
  }</DynamicImport>
)
`
}
/*AST's object should be {
  path: [arr of paths jackie and rachel said they needed to traverse],
  components: {
    <object below>
  }
}
*/
const object = {
  Main: {
    name: 'Main',
    path: './Main',
  },
  App: {
    name: 'App',
    path: './App',
  },  
  Entry: {
    name: 'Entry',
    path: './Entry',
  },  
  Last: {
    name: 'Last',
    path: './Last',
  },
}
let exportLine = 10;
// parameters: commponent objects and export line from outer obj to insert there
console.log(createDynamicInjection(object, exportLine))