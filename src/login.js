import React, { useState } from "react";
import HtImage from "./Ht.png";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { useAuth } from './AuthContext';


export default function Login() {
  // State to store user inputs
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent form from refreshing the page
    
    const loginData = {
      username: email, // Use 'email' here instead of undefined 'username'
      password: password,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api-token-auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData), // Convert login data to JSON string
      });

      if (response.ok) {
        const result = await response.json();
        login()
        localStorage.setItem('access', result.access)
        localStorage.setItem('refresh', result.refresh)
        localStorage.setItem('user', JSON.stringify(result.user))
        navigate("/dashboard");
      } else {
        setResponseMessage('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setResponseMessage('Error during login');
    }
  };

  return (
    <div className="login-form">
      <img src={HtImage} alt="my-local-image" />
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update state when input changes
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {responseMessage && <div>{responseMessage}</div>}
    </div>
  );
};


export const Logout = async () => {
  const refreshData = {
    'refresh': localStorage.getItem('refresh')
  };
  try {
    const response = await fetch('http://127.0.0.1:8000/logout/', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access')
      },
      body: JSON.stringify(refreshData)
    }); // API endpoint
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const result = await response.json();
    console.log(result);
  } catch (error) {
    throw error;
  }
};
