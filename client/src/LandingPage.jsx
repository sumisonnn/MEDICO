import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import landingImage from "./assets/pharama.png";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/homepage");
  };

  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-content">
          <div className="landing-text">
            <h1 className="landing-title">MEDICO</h1>
            <h2 className="landing-subtitle">HEALTH IS WEALTH</h2>
            <button className="landing-btn" onClick={handleClick}>
              LET’S GO
            </button>
          </div>
          <div className="landing-image">
            <img src={landingImage} alt="Landing" />
          </div>
        </div>
      </div>
    </div>
  );
} 