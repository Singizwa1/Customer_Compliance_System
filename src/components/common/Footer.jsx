import { FiHeart, FiMail, FiPhone, FiMapPin } from "react-icons/fi"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Customer Complaints System</h3>
          <p>A comprehensive solution for managing and resolving customer complaints efficiently.</p>
        </div>

        <div className="footer-section">
          <h3>Contact Information</h3>
          <ul className="contact-list">
            <li>
              <FiPhone className="footer-icon" />
              <span>+250 788 123 456</span>
            </li>
         
            <li>
              <FiMapPin className="footer-icon" />
              <span>Kigali, Rwanda</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {currentYear} Customer Complaints System. All rights reserved. Made with{" "}
          <FiHeart className="heart-icon" /> Rwanda National Investement Trust
        </p>
      </div>
    </footer>
  )
}

export default Footer
