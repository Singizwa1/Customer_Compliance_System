import './chartConfig';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./styles/global.css"

// Context Providers
import { AuthProvider } from "./contexts/AuthContext"
import { NotificationProvider } from "./contexts/NotificationContext"

// Pages
import Landing from "./pages/Landing"
import Login from "./pages/Login" // ✅ Added Login page
import Dashboard from "./pages/Dashboard"
import Complaints from "./pages/Complaints"
import ComplaintDetail from "./pages/ComplaintDetail"
import NewComplaint from "./pages/NewComplaint"
import Users from "./pages/Users"
import Reports from "./pages/Reports"
import NotFound from "./pages/NotFound"
import Settings from "./pages/Settings/Settings"

// Components
import ProtectedRoute from "./components/common/ProtectedRoute"

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} /> {/* ✅ Login route added */}

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/complaints"
              element={
                <ProtectedRoute>
                  <Complaints />
                </ProtectedRoute>
              }
            />
            <Route
              path="/complaints/:id"
              element={
                <ProtectedRoute>
                  <ComplaintDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/new"
              element={
                <ProtectedRoute roles={["customer_relations_officer"]}>
                  <NewComplaint />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute roles={["customer_relations_officer", "complaints_handler"]}>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute roles={["admin", "customer_relations_officer"]}>
                  <Reports />
                </ProtectedRoute>
              }
            />

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  )
}

export default App;
