import React, {useState} from 'react';
import "./Button.css"

const Button = (props) => {
    
    const [value, setValue] = useState(false)
    const handleClick = () =>{
        props.toggle(!props.show)
        setValue(!value)
    }
  return (
    <div className="legend_btn">
        <button className="btn"
        onClick={handleClick}>{value? "Show":"Hide"} <br/> Legend</button>
    </div>
  )
}

export default Button