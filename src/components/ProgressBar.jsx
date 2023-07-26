import React from 'react'
import {useScroll, motion} from "framer-motion";

const Playground = () => {
    const { scrollYProgress } = useScroll()

    return (
    <>
        <motion.div className="progress-bar" style={{ scaleX: scrollYProgress }} />
    </>
    )
}

export default Playground