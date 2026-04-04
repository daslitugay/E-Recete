import { Navigate } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "../utils/auth";

function RoleGuard({ allowedRoles, children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getCurrentUser();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleGuard;