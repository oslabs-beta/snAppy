import * as React from "react";
import { withRouter } from 'react-router';


//  const Chart = () => {
//     return (
//       <div className="nav">
//         Hey hey!
//       </div>
//     )
//   }

//   export default Chart;

const optimizeBtn = (props: any) =>{
    const {
        history,
        to,
        onClick,
      } = props
    return (
    <button
    onClick={(event: any) => {
        onClick && onClick(event)
        history.push(to)
      }}/>
    )
}


export default withRouter(optimizeBtn)