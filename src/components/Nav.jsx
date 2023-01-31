import React from 'react';
import "./Nav.css"
// import World from "../images/world.svg";
import logo from "../images/globe_logo.png"

const Nav = () => {
  return (
    <header>
      <div className="container">
        <nav>
        <span className="logo"><img src={logo} alt="logo" /></span>
        <h3 className="logo">Eliect</h3>

          <ul className="nav_items">
                    <li><a href="Home">Home</a></li>
                    <li><a href="About">About</a></li>
                    <li><a href="Products">Products</a></li>
                    <li><a href="find_us">Find Us</a></li>
                    
                    <li><a href="Contact">Contact Us</a></li>
                </ul>
          </nav>

          <div className="grid">
            <div className="n_content">
              <h2 className="content_title">
                Eliect Point
              </h2>
              <h3 className="content_subtitle">
                Spatial Business Intelligence
              </h3>

              <p className="n_paragraph">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia voluptatibus 
                fugiat tenetur consequatur repellendus quibusdam reprehenderit reiciendis ut nam eligendi.
              </p>
            </div>

            <article className="img">
              {/* <img className="svg" src={global.svg} alt="Lady pointing at world" /> */}
            </article>
          </div>
      </div>
    </header>
  )
}

export default Nav