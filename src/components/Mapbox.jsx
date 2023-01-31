import React, {useState, useRef, useEffect, useCallback} from 'react';
// import styled from "styled-components";
import ReactMapGL, {Layer, Marker, FullscreenControl, GeolocateControl, NavigationControl} from "react-map-gl";
import "./Mapbox.css";
// import Legend from "./Legend";
import Info from "./Info";

import Bike from '@mui/icons-material/DirectionsBike';
import Drive from '@mui/icons-material/DriveEta';
import Walk from '@mui/icons-material/DirectionsRun';



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
    const [color, setColor] = useState("blue")
    const [currentPosition, setCurrentPosition] = useState([])
    const [distance, setDistance] = useState(null)
    const [time, setTime] = useState(null)
    const geoRef = useRef()
    
    // const [road,setRoad] = useState({})

    // useEffect(()=>{
    //   navigator.geolocation.getCurrentPosition((position)=>{
    //     setCurrentPosition([position.coords.longitude, position.coords.latitude])
    //   });
    //   console.log(currentPosition)
    // },[message])
  
    

    const handleMove = evt => {
      return(
        setViewport(evt.viewport)
      )
    }    

    
    // getting route
    const getRoute = async (start, end, profile,color) =>{
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
        switch(profile){
          case "cycling":setColor("yellow");
          break;
          case "driving":setColor("red");
          break;
          case "walking":setColor("purple");
          break;
          default:
            break;
        }
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
            "line-color":color,
            "line-width":4,
            "line-opacity":0.75
          }
        });
      }      
      // every time we update the route, we also update the instructions
      setInstructions(data.legs[0].steps)
      setDistance(data.distance)
      setTime(data.duration)
      } 
  
  return (
    <section className="map_wrapper">
      <Info distance={distance} time={time}/>

      <ReactMapGL
        ref={mapRef}
        mapStyle="mapbox://styles/wayne-geet/cld0c6fb2003314qm2coqihkl"
        mapboxAccessToken={process.env.REACT_APP_ACCESS_TOKEN}
        {...viewport}
        onViewportChange = {newViewport => setViewport(newViewport)}
        onMove={handleMove}
        // onMouseMove = {handleHover}
        onLoad={()=>{
          setCurrentPosition(geoRef.current.trigger())
        }}

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
          setEnd(coord)
          getRoute(currentPosition, coord, profile, color)
          
          
          }}
        >
          <FullscreenControl
      containerId="map_wrapper"/>  

      <GeolocateControl
      ref={geoRef}
      enableHighAccuracy={true}
      onGeolocate={(e)=>{
        setCurrentPosition([e.coords.longitude, e.coords.latitude])
      }}/>       

      <NavigationControl/>
          
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

      <article className="mode">
            <div className="card"
            onClick={()=>{
              setProfile("cycling")
              setColor("orange")
              getRoute(start,end, profile, color)
            }}>
                <h3 className="title">Bicycle</h3>
                <div className="profile"><Bike/></div>
            </div>

            <div className="card"
            onClick={()=>{
              setProfile("driving")
              setColor("blue")
              getRoute(start, end, profile, color)
            }}>
                <h3 className="title">Drive</h3>
                <div className="profile"><Drive/></div>
            </div>

            <div className="card"
            onClick={()=>{
              setProfile("walking")
              setColor("red")
              getRoute(start, end, profile, color)
            }}>
                <h3 className="title">Walk</h3>
                <div className="profile"><Walk/></div>
            </div>


        </article>
      
    </section>


    
  )
}

export default Mapbox;
