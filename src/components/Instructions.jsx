import React from 'react'

const Instructions = ({step, no_}) => {
  return (
    <article className="flex justify-start items-center gap-5">
        <div className="text-gray-400">{no_}</div>
        <p className="text-gray-400 font-semibold text-sm">{step}</p>
    </article>
  )
}

export default Instructions