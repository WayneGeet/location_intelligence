import React, {useState, useEffect, useRef} from 'react';
import ReactMapGl, {FullscreenControl, GeolocateControl, Marker, Source, Layer, NavigationControl} from 'react-map-gl';
import Instructions from "./Instructions";
import Places from "./Places";

function Map() {
  const [viewState, setViewState] = useState({
    longitude: -73,
    latitude: 42,
    zoom: 6.5
  });

  const [start, setStart] = useState([-73, 42]);
  const [end, setEnd] = useState([-73, 42]);
  const [coords, setCoords] = useState([]);
  const [steps, setSteps] = useState([])

  const GeolocateControlRef = useRef();

  useEffect(()=>{
    getRoute()
    // GeolocateControlRef.current?.trigger()
  }, [end, GeolocateControlRef])

  const getRoute = async () => {
    const response = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`);
    const data = await response.json();
    const coords = data.routes[0].geometry.coordinates
    setCoords(coords)
    const steps = data.routes[0].legs[0].steps
    setSteps(steps)
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

  return (
    <section className="relative w-full h-full">
      <ReactMapGl
        {...viewState}
        onClick={handleClick}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/wayne-geet/clk9alnap00oh01qy18um4etm"
        // navigation-dark => mapbox://styles/wayne-geet/cljy8wzzp005m01pf5ooxh8oz
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

      {steps && <article className="bg-slate-800 rounded-md px-5 py-3 max-h-[50vh] absolute top-5 left-5 overflow-y-auto max-w-sm">
        {steps.map((item, i) => {
          return(
            <div key={i} className="flex flex-col gap-4">
              <Instructions no_={i+1} step={item.maneuver.instruction}/>
            </div>
          )
        })}
      </article>}

      {/* Search Bar and places goes here */}
      <Places setEnd={setEnd}/>
  </section>
  )
}
export default Map;