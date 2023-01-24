import React, {useState} from 'react';
import Button from "./Button";
import "./Legend.css"

const Legend = () => {
    const [layers, setLayers] = useState(['0-10','10-20','20-50','50-100','100-200','200-500','500-1000','1000+']);
    const [colors, setColors] = useState(['#FFEDA0','#FED976','#FEB24C','#FD8D3C','#FC4E2A','#E31A1C','#BD0026','#800026']);
    const [show, setShow] = useState(true)
    
  return (
    <div>
        <div className={show ? "legend" : "legend_hid"}>
        <h3 className="lg_title">Legend</h3>
        
        <article>
            {layers.map((layer, i) =>{
            const color = colors[i];
            return(
            <article className="layer_item"
            key={i}>
                <div className="color_index"
                style={{backgroundColor:color,
                    width:"6px",
                    padding:"6px"}}>
                </div>

                <li key={i} className="layer_item">{layer}</li>
            </article>
            )
            })}
        </article>
        </div>

        <Button toggle={setShow} 
    show={show}/>
    </div>
  )
}

export default Legend