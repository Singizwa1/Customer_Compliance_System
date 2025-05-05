import { Link } from "react-router-dom"
import { FiHome } from "react-icons/fi"
import "../styles/global.css"

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">
          <FiHome />
          <span>Go to Home</span>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
