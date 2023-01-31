import React from 'react';
import "./Info.css"

const Info = (props) => {
  return (
    <div>
        <div className="info">
        <h2>Time: {props.time/60}mins</h2>
        <p>Distance: {props.distance} m</p>
        
      </div>
    </div>
  )
}

export default Info