import React, {useState, useRef, useEffect, useCallback} from 'react';
// import styled from "styled-components";
import ReactMapGL, {Layer, Marker, FullscreenControl, GeolocateControl} from "react-map-gl";
import "./Mapbox.css";
// import Legend from "./Legend";
import Info from "./Info";



const Mapbox = () => {

    const [viewport, setViewport] = useState({
        width:"100%",
        height:"100%",
        longitude:36.963387,
        latitude:-0.393704,
        zoom:15
    })

    

    // Geolocation


    const[map, setMap] = useState(null)
    const [message, setMessage] = useState("")
    const [start, setStart] = useState([36.963387,-0.393704])
    const [end, setEnd] = useState([ 36.963387,-0.399704])
    const mapRef = useRef();
    const [instructions, setInstructions] = useState([])
    const [profile, setProfile] = useState("driving")
    const [currentPosition, setCurrentPosition] = useState([])
    // const [road,setRoad] = useState({})

    useEffect(()=>{
      navigator.geolocation.getCurrentPosition((position)=>{
        setCurrentPosition([position.coords.longitude, position.coords.latitude])
      });
      console.log(currentPosition)
    },[message])
    

    const handleMove = evt => {
      return(
        setViewport(evt.viewport)
      )
    }    

    
    // getting route
    const getRoute = async (start, end, profile) =>{
      const map = mapRef.current.getMap()
      const api = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${profile}/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${process.env.REACT_APP_ACCESS_TOKEN}`,
        { method: 'GET' }
      );
      const json = await api.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;
        // create a geojson that will be passed into the "data" part of the source...this is our data
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };
      // Adding the route to the map
      if (map.getSource('route')) {
        // checks to see whether a layer with the id of "route" exists in the map
        map.getSource('route').setData(geojson);
      }

      else{
        map.addLayer({
          id:"route",
          type:"line",
          source:{
            type:"geojson",
            data:geojson
          },
          layout:{
            "line-join":"round",
            "line-cap":"round"
          },
          paint:{
            "line-color":"blue",
            "line-width":4.5,
            "line-opacity":0.75
          }
        });
      }      
      // every time we update the route, we also update the instructions
      setInstructions(data.legs[0].steps)
      } 
  
  return (
    <section className="map_wrapper">
      <Info message={message}/>
      

      <ReactMapGL
        ref={mapRef}
        mapStyle="mapbox://styles/wayne-geet/cld0c6fb2003314qm2coqihkl"
        mapboxAccessToken={process.env.REACT_APP_ACCESS_TOKEN}
        {...viewport}
        onViewportChange = {newViewport => setViewport(newViewport)}
        onMove={handleMove}
        // onMouseMove = {handleHover}
        // onLoad={()=>{                 
          
        // }}

        onClick = {(e)=>{
          const map = mapRef.current.getMap()
          const coord = Object.keys(e.lngLat).map((key)=>e.lngLat[key])
          console.log(coord)
          // create an ending point
          const end = {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: coord
                }
              }
            ]
          };
          if (map.getLayer('end')) {
            map.getSource('end').setData(end);
          } else {
            map.addLayer({
              id: 'end',
              type: 'circle',
              source: {
                type: 'geojson',
                data: {
                  type: 'FeatureCollection',
                  features: [
                    {
                      type: 'Feature',
                      properties: {},
                      geometry: {
                        type: 'Point',
                        coordinates: coord
                      }
                    }
                  ]
                }
              },
              paint: {
                'circle-radius': 10,
                'circle-color': '#f30'
              }
            });
          };
          getRoute(currentPosition, coord, profile)
          
          
          }}
        >
          <FullscreenControl
      containerId="map_wrapper"/>  

      <GeolocateControl
      enableHighAccuracy={true}/>       
          
          {/* <Layer
          source={road}></Layer> */}

          {/* <Marker longitude={start[0]} 
          latitude={start[1]}
           anchor="bottom" >
          </Marker> */}
          
      </ReactMapGL>

      <div className="directions">
        {instructions.map((direction, keys)=>{
          return(
            <li key={keys}
            className="instruction">{keys + 1} {direction.maneuver.instruction}</li>
          )
        })}
      </div>

      {/* <Legend /> */}
      
    </section>

    
  )
}

export default Mapbox;
