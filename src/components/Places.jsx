import React from 'react'

const Places = ({text, place_name}) => {
  return (
    <div className="flex flex-col gap-[2px] bg-white px-4 py-2 hover:bg-gray-200 cursor-pointer">
        <h2 className="pointer-events-none cut font-semibold text-gray-800 text-[0.9rem]">{text}</h2>
        <p className="pointer-events-none cut text-[0.8rem] text-gray-500">{place_name}</p>
    </div>
  )
}

export default Places