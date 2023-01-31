import React from 'react';
import "./Card.css";
import {motion} from "framer-motion";
import Transport from '@mui/icons-material/DirectionsTransit';
import Customer from '@mui/icons-material/Sell';
import Insurance from '@mui/icons-material/LocalHospital';
import Property from '@mui/icons-material/House';
import Telecom from '@mui/icons-material/PhonelinkRing';
import Retail from '@mui/icons-material/SupportAgent';

const Card = () => {
    const card_data = [
        {title:"Transport",
        icon:<Transport/>,
        info:"What routes have the greatest on-time deliveries and what routes show significant changes in delivery time"},
        {title:"Retail",
        icon:<Retail/>,
        info:"Who are your best customers and where are they located? Where can you find potential customers with similar demographic characteristics?"},
        {title:"Insurance",
        icon:<Insurance/>,
        info:"Is there a relationship between a risk factor and location of policy holders? "},
        {title:"Telecom",
        icon:<Telecom/>,
        info:"Which locations provide the the best network coverage at the lowest possible price and how can this better the economy?"},
        {title:"Real Estate",
        icon:<Property/>,
        info:"What optimum sites exist that development can take place? Real estate is all about location because of the people served by that location"},
        {title:"Customer",
        icon:<Customer/>,
        info:"How long does it take you to deliver a product or is there a store nearby?Can we identify customers who are downstream of a service outage and preemptively alert them?"}
    ]

  return (
    <div className="applications">
        {card_data.map((card)=>{
            return(
                <motion.div
                 className="c_card"
                 id={card_data.title}
                 animate={{x:0}}
                 initial={{x:800}}
                 transition={{ease:"easeOut", duration:0.8}}
                 whileHover={{scale:1.1, duration:0.5}}
                 >
                    <div className="c_top">
                        <h3 className="c_title">{card.title}</h3>
                        <span>{card.icon}</span>
                    </div>
                    <div className="paragraph">
                        <p className="c_content">{card.info}</p>
                    </div>
                </motion.div>
            )
        })}
    </div>
  )
}

export default Card
