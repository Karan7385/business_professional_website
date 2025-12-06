import { Navigate } from "react-router-dom";
import getCookie from "../../../utils/getCookie.js";

export default function ProtectedRoute({ children }) {
  const token = getCookie("admin_token");

  // If no token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists → allow page to load
  return children;
}