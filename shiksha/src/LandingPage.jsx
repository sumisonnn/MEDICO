import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import landingImage from "./assets/MEDICOOO.jpg"; 

export default function LandingPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="landing-text">
          <div className="landing-title">
            <h1>MEDICO</h1>
          </div>
          <h2>
            Start your <br /> journey with us
          </h2>
          
          <button className="primary-button" onClick={handleClick}>
            LET’S GO
          </button>
        </div>
        <div className="landing-image">
          <img src={landingImage} alt="Landing" />
        </div>
      </div>
    </div>
  );
}
