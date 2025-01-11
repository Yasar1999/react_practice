import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Assuming you have an AuthContext that provides isLoggedIn

const ProtectedRoute = ({ element  }) => {
    const { isLoggedIn } = useAuth(); // Get login status
  
    return isLoggedIn  ? element  : <Navigate to="/" />;
  };
  
export default ProtectedRoute;
