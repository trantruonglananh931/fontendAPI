import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/useAuth";

type Props = { children: React.ReactNode };

const ProtectedRoute = ({ children }: Props) => {
  const location = useLocation();
  const { user } = useAuth();
  
  if (!user || user.role !== "Admin") {
    return <Navigate to="/product" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
