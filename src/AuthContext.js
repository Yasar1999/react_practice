import React, { useState, createContext, useContext, useEffect } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider to wrap the app and provide the auth state
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading] = useState(true);

    useEffect(() => {
      const storedLoginStatus = sessionStorage.getItem('isLoggedIn');
      if (storedLoginStatus === 'true') {
        setIsLoggedIn(true);
      }
    }, []);

    // const refreshAccessToken = useCallback(async () => {
    //   const refreshToken = localStorage.getItem('refresh');
    //   if (!refreshToken) {
    //     logout();
    //     return null;
    //   }
  
    //   try {
    //     const response = await fetch('http://127.0.0.1:8000/api-token-refresh/', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ refresh: refreshToken }),
    //     });
  
    //     if (response.ok) {
    //       const result = await response.json();
    //       localStorage.setItem('access', result.access);
    //       return result.access;
    //     } else {
    //       logout();
    //       return null;
    //     }
    //   } catch (error) {
    //     console.error('Failed to refresh access token:', error);
    //     logout();
    //     return null;
    //   }
    // }, []); // No dependencies needed
  
    // // Function to check token expiration
    // const checkTokenExpiration = useCallback(async () => {
    //   const accessToken = localStorage.getItem('access');
    //   if (!accessToken) {
    //     setIsLoggedIn(false);
    //     return false;
    //   }
  
    //   try {
        // const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
        // const currentTime = Math.floor(Date.now() / 1000);
  
        // if (tokenPayload.exp < currentTime) {
    //       const newAccessToken = await refreshAccessToken();
    //       if (newAccessToken) {
    //         setIsLoggedIn(true);
    //         return true;
    //       }
    //       return false;
    //     }
  
    //     setIsLoggedIn(true);
    //     return true;
    //   } catch (error) {
    //     console.error('Error checking token expiration:', error);
    //     setIsLoggedIn(false);
    //     return false;
    //   }
    // }, [refreshAccessToken]); // Include refreshAccessToken as a dependency
  
    // // Check token status on initial load
    // useEffect(() => {
    //   const loggedInStatus = sessionStorage.getItem('isLoggedIn') === 'true';
    //   if (loggedInStatus) {
    //     checkTokenExpiration().then((isValid) => setIsLoggedIn(isValid));
    //   } else {
    //     setIsLoggedIn(false);
    //   }
    //   setLoading(false);
    // }, [checkTokenExpiration]); // Include checkTokenExpiration as a dependency
  
  
    // Function to login
    const login = () => {
      setIsLoggedIn(true);
      sessionStorage.setItem('isLoggedIn', true);  // Save login status in session storage
    };
  
    // Function to logout
    const logout = () => {
      setIsLoggedIn(false);
      sessionStorage.removeItem('isLoggedIn');  // Remove login status from session storage
    };
  
  
    return (
      <AuthContext.Provider value={{ isLoggedIn, login, logout, loading}}>
        {children}
      </AuthContext.Provider>
    );
  };