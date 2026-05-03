import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  
  if (role && userRole !== role) {
    return <Navigate to="/auth" replace />;
  }

  
  return children;
};

export default ProtectedRoute;