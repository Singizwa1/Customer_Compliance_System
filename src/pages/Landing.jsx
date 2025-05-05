import React from "react";
import { FiCheck } from "react-icons/fi";
import Footer from "../components/common/Footer";
import "../styles/landing.css";
import logo from "../assets/logo.jpeg";     
import secondaryLogo from "../assets/iterambere.jpeg";  
import Login from "./Login";

const Landing = () => {
  return (
    <div className="landing-page">
      <div className="landing-container">
        {/* Left Side */}
        <div className="left-section">
          <div className="top-header">
            <img src={logo} alt="RNIT Logo" className="logo" />
            <h2 className="org-name">Rwanda National Investment Trust</h2>
          </div>

          <div className="centered-content">
            <h1 className="title">Welcome to Customer Complaints System</h1>
            <p className="subtitle">Manage and handle customer complaints easily</p>

            <ul className="features-list">
              <li>
                <span className="check-icon"><FiCheck /></span>
                Identify Customer Complaints
              </li>
              <li>
                <span className="check-icon"><FiCheck /></span>
                Address Customer Complaints
              </li>
              <li>
                <span className="check-icon"><FiCheck /></span>
                Handle Customer Complaints
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="right-section">
          <div className="secondary-logo-container">
            <img src={secondaryLogo} alt="Secondary Logo" className="secondary-logo" />
          </div>
          <Login />
        </div>
      </div>
      <Footer /> {/* Footer remains unchanged as per your request */}
    </div>
  );
};

export default Landing;