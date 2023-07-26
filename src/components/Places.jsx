import {useState, useEffect} from "react";
import {AiOutlineSearch, AiOutlineClose} from "react-icons/ai"
import loader from './Rolling-1s-200px.gif';

function Places ({setEnd}) {
    const [places, setPlaces] = useState([]);
    const [value, setValue] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    useEffect(()=>{
        getPlaces()
    },[value])
    const getPlaces = async () => {
        setIsLoading(true)
        const promise = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`)
        const data = await promise.json();
        setPlaces(data.features)
        console.log(data.features)
        setIsLoading(false)
    }

    const handleClick = (place) => {
        // console.log("hello web spatialists")
        setEnd(place.geometry.coordinates)
        
    }
    return(
        <section className="absolute top-5 right-10">
            <article className="rounded-md">
                <div className="flex items-center justify-center w-full px-2 rounded-md bg-white">
                    <div className=""><AiOutlineSearch size={18}/></div>
                    <input className="w-full px-4 py-2 outline-none" placeholder="Enter Endpoint" value={value} onChange={(e)=>setValue(e.target.value)} type="text" name="place" id="place" />
                    <div onClick={()=> setValue('')} className="cursor-pointer relative">
                        {isLoading && <img className='absolute top-0 left-0 transform -translate-x w-5 h-5' src={loader} alt="loading gif"/>}
                        <AiOutlineClose size={18}/>
                    </div>
                </div>

                <article className="max-w-sm ">
                    {places?.map((items) => {
                        return(
                            <div key={items.id} onClick={() => handleClick(items)} className="px-4 flex items-center justify-start bg-white py-2 hover:bg-gray-200 cursor-pointer">
                                <h4 className="w-full text_cut text-[0.9rem] font-semibold pointer-events-none">{items.text}</h4>
                                <p className="text_cut text-[0.8rem] text-gray-500 pointer-events-none">{items.place_name}</p>
                            </div>
                        )
                    })}
                </article>

            </article>
        </section>
    )
}

export default Places;