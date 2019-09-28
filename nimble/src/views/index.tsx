import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

// import './index.css';

//CONDITIONAL RENDERING
          //if props.bunleStats then return <Visualization> component imported from vis files
             //otherwise it will default to the logic below
             //but once optimized is clicked the message is send and once optimizaiton is done the backend should send the stats to the front end and update state.bundleStats with it
             //the on props.bundleStats change to true from undefined and will render try to load the visualziation
             //the <Visualization> component will be rendered in Suspense and the import will be lazy loaded 
             //the fallback will be a GIF cat coding or snapping , until the component is fully loaded and the graph will be displayed
            //  const Visualization = React.lazy(() => import('./Visualization'));
            //  function Visualize (props) {
            //      const stats= props.bundleStats
            //      if (stats) {
            //          <Suspense fallback={<some GIF />}>
            //              <Visualization />
            //          </Suspense>
            //      }
            //      return <App/>
            //  }

ReactDOM.render(
    //<Visualize stats={}/>
    <App/>,
    document.getElementById('root')
);