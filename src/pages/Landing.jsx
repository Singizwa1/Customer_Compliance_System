import React, { useEffect } from "react";
import { IoCheckboxOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import Footer from "../components/common/Footer";
import logo from "../assets/logo.png";
import heroImage from "../assets/background.jpeg"; // Replace with your image path
import "../styles/landing.css";

const Landing = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div className="landing-page">
      {/* Navbar */}
      <header className="navbar">
        <div className="nav-left">
          <img src={logo} alt="RNIT Logo" className="logo" />
          <h2 className="org-name">Rwanda National Investment Trust</h2>
        </div>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about-us">About Us</Link>
          <Link to="/login">
            <button className="get-started-btn">Get Started</button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section" data-aos="fade-up">
        <div className="hero-content">
          <div className="hero-message">
            <h1 className="hero-title">Welcome to the Customer Complaints System</h1>
            <p className="hero-subtitle">
              This platform is designed to help Customer Relations Officers efficiently record complaints and promptly forward them to the appropriate handlers. It improves response time, accountability, and ensures every concern is addressed in a timely and organized manner.
            </p>
            <div className="cta-buttons">
              <Link to="/about-us">
                <button className="cta-btn about-us-btn">Learn More</button>
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img src={heroImage} alt="Hero Image" className="hero-img" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" data-aos="fade-up">
        <h2 className="section-title">Why Choose Our System?</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon">
              <IoCheckboxOutline />
            </div>
            <h3 className="feature-title">Efficient Complaint</h3>
            <p className="feature-description">
              Easily record complaints with a streamlined form, ensuring all necessary details are captured accurately.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <IoCheckboxOutline />
            </div>
            <h3 className="feature-title">Smart Complaint Routing</h3>
            <p className="feature-description">
              Automatically forward complaints to the appropriate department or officer, reducing delay and confusion.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <IoCheckboxOutline />
            </div>
            <h3 className="feature-title">Timely Resolution Tracking</h3>
            <p className="feature-description">
              Monitor complaint status and resolution timelines to ensure accountability and performance improvement.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta" data-aos="zoom-in">
        <h2 className="title">Ready to Get Started?</h2>
        <p>Join hundreds of organizations already improving their customer experience today.</p>
        <Link to="/login">
          <button className="get-started-btn">Get Started</button>
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;