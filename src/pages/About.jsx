import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { IoCheckboxOutline } from "react-icons/io5";
import Footer from "../components/common/Footer";
import logo from "../assets/logo.png";
import "../styles/landing.css"; 

const About = () => {
  const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="about-us-page">
      {/* Navbar */}
      <header className="navbar">
        <div className="nav-left">
          <img src={logo} alt="RNIT Logo" className="logo" />
          <h2 className="org-name">Rwanda National Investment Trust</h2>
        </div>

        <nav className="nav-links">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
          <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>
                      About Us
                    </Link>
          <Link to="/login">
            <button className="get-started-btn">Get Started</button>
          </Link>
        </nav>
      </header>
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

export default About;
