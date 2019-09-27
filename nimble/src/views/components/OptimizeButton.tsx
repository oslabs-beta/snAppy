import {withRouter} from 'react-router';
import * as React from "react";


const optimizeBtn = (props: any) =>{
    const {
        history,
        location,
        match,
        staticContext,
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