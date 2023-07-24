import './App.css';
import React from "react";
import Home from "./Pages/Home"
import Products from "./Pages/Products"
import Map from "./components/Map"
function App() {
  return (
    <div className="App">
      <Home/>
      <Products/>
      <Map/>
    </div>
  );
}

export default App;
