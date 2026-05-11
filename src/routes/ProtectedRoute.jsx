import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  role,
  adminOnly = false,
}) => {

  const token =
    localStorage.getItem("token");

  const userRole =
    localStorage.getItem("role");

  const isAdmin =
    localStorage.getItem("is_admin");

  
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  
  if (
    adminOnly &&
    isAdmin !== "true"
  ) {
    return <Navigate to="/" replace />;
  }

  
  if (
    role &&
    userRole !== role
  ) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;