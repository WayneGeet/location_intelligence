import React, {useState, useEffect, useRef} from 'react';
import ReactMapGl, {FullscreenControl, GeolocateControl, Marker, Source, Layer, NavigationControl} from 'react-map-gl';
import Instructions from "./Instructions";
import Places from "./Places"

function Map() {
  const [viewState, setViewState] = useState({
    longitude: -73,
    latitude: 42,
    zoom: 7.5
  });

  const [start, setStart] = useState([-73, 42]);
  const [end, setEnd] = useState([-73, 42.7]);
  const [coords, setCoords] = useState([]);
  const [steps, setSteps] = useState([])
  
  const [value, setValue] = useState("")

  const [place, setPlace] = useState([])

  const GeolocateControlRef = useRef();

  useEffect(()=>{
    getRoute()
    GeolocateControlRef.current?.trigger()
  }, [end, GeolocateControlRef])


  useEffect(()=> {
    getPlaces()
  }, [value])


  const getRoute = async () => {
    const response = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`);
    const data = await response.json();
    const coords = data.routes[0].geometry.coordinates
    setCoords(coords)
    const steps = data.routes[0].legs[0].steps
    setSteps(steps)
  }

  // fetching places
  const getPlaces = async () => {
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?autocomplete=true&fuzzymatch=true&access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`)
    const data = await response.json()
    setPlace(data.features)
  }
  // 1. geojson
const geojson = {
  "type":"FeatureCollection", 
  "features":[{
      "type":"feature",
      "geometry":{
          "type":"LineString",
          "coordinates":[
              ...coords
          ]
      }
  }
  ]
}
// Route styles
const lineStyle = {
  id: 'roadLayer',
  type: 'line',
  layout:{
      "line-join":"round",
      "line-cap":"round"
    },
    paint:{
      "line-color":"blue",
      "line-width":4,
      "line-opacity":0.75
    }
};

// 3. endPoint
const endPoint = {
  "type":"FeatureCollection", 
  "features":[{
      "type":"feature",
      "geometry":{
          "type":"Point",
          "coordinates":[...end]
      }
  }
  ]
}

const layerEndpoint = {
  id: 'end',
  type: 'circle',
  source: {
    type: 'geojson',
    data: end
  },
  paint: {
    'circle-radius': 10,
    'circle-color': '#f30'
  }
}

  const handleClick = (e) => {
    const newEnd = e.lngLat
    const endPoint = Object.keys(newEnd).map((item, i) => newEnd[item])
    setEnd(endPoint)
  }

  const handlePlace = (place) => {
    setEnd(place.geometry.coordinates)
  }

  return (
    <section className="relative">
      <ReactMapGl
        {...viewState}
        onClick={handleClick}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/wayne-geet/clk9alnap00oh01qy18um4etm"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        style={{width:"100vw", height:"100vh"}}
      >
        <Source id="routeSource" type="geojson" data={geojson}>
          <Layer {...lineStyle}/>
        </Source>
        <Source id="endSource" type="geojson" data={endPoint}>
          <Layer {...layerEndpoint}/>
        </Source>

        <GeolocateControl showAccuracyCircle={false} onGeolocate={(e)=> setStart([e.coords.longitude, e.coords.latitude])} ref={GeolocateControlRef} />
        <FullscreenControl/>
        <NavigationControl/>
        <Marker longitude={start[0]} latitude={start[1]}/>
      </ReactMapGl>;

      <article className="bg-slate-800 rounded-md px-5 py-3 max-h-[50vh] absolute top-5 left-5 overflow-y-auto max-w-sm">
        {steps.map((item, i) => {
          return(
            <div key={i} className="flex flex-col gap-4">
              <Instructions no_={i+1} step={item.maneuver.instruction}/>
            </div>
          )
        })}
      </article>

      <section className="absolute right-10 top-5 ">
        <form >
          <input
          placeholder="Nairobi, Kenya"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="rounded-md px-4 py-2 text-gray-600 text-[0.9rem] w-[15rem]"
          type="text" name="place" id="place" />
        </form>

        <article className="mt-4 rounded-md">
          {place?.map((item) => {
            return(
              <div
              onClick={(e)=>handlePlace(item)}
              key={item.id} className="justify-start w-[15rem] max-w-[15rem]">
                <Places text={item.text} place_name = {item.place_name}/>
              </div>
            )
          })}
        </article>
      </section>
  </section>
  )
}
export default Map;