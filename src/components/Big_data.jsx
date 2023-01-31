import React from 'react';
import "./Big_data.css";
import Card from "./Card";


const Big_data = () => {

  return (
    <div className="products">
        <div className="container">
            <div className="grid_b">
                <article className="b_content">
                    <h2 className="sbi">Business Intelligence</h2>
                    <p className="product_content">
                        Business Intelligence referes to applications and technologies that are used
                        to gather, provide access to, and analyze data and information about company operations
                    </p>

                    <button className="learn_more">Learn More</button>
                </article>

                <div className="applications">
                    <Card/>
                </div>
            </div>


        </div>
    </div>
  )
}

export default Big_data