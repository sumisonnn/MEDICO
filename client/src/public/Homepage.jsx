import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
import HeroImage from '../assets/pharama.png'; // Use a relevant pharma image
import logoIcon from '../assets/MEDICOOO.jpg'; // Your MEDICO logo path

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      {/* Top Navigation */}
      <header className="navbar">
        <div className="logo">
          <img src={logoIcon} alt="Logo" className="logo-image" />
          <span>MEDICO</span>
        </div>
        <nav className="nav-links">
          <Link to="/login" className="nav-link">Login</Link>
          <button onClick={() => navigate('/signup')} className="signup-btn">Signup</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            MEDICO <br />
            <span className="highlight">SMART PHARMACY SOLUTION</span>
          </h1>
          <p>
            Manage inventory, sales, and prescriptions seamlessly.
          </p>
          <button className="get-started" onClick={() => navigate('/login')}>Get Started</button>
        </div>

        <div className="hero-image">
          <img src={HeroImage} alt="Pharmacy management" />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-item">
            <h4>Contact Us</h4>
            <p>📞 9800000000</p>
            <p>📧 support@medico.com</p>
            <p>🏢 Kalanki, Kathmandu</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
