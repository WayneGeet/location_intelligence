import React from 'react';
import "./Info.css"

const Info = (props) => {
  return (
    <div>
        <div className="info">
        <h2>Directions from Portland</h2>
        <div className="message">{props.message}</div>
      </div>
    </div>
  )
}

export default Info