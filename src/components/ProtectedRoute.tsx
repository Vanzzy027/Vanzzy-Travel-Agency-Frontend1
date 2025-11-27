import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import type { RootState } from '../store/store'; // Adjust path as needed

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredUserType 
}) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.authSlice);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredUserType && user?.user_type !== requiredUserType) {
    // Redirect to appropriate dashboard based on user type
    switch (user?.user_type) {
      case 'admin':
        return <Navigate to="/AdminPage/dashboard" replace />;
      case 'restaurant_owner':
        return <Navigate to="/restaurant/dashboard" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;