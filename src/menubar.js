import React, { useState, useEffect } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import the auth hook for login state
import './index.css';
import ProfileImage from './default-profile.png'
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Logout } from './login';

const MenuBar = () => {
  // Always call hooks at the top of the function
  const { isLoggedIn, logout } = useAuth(); // Get the login status
  const navigate = useNavigate();

  // State for dropdown title (always call hooks)
  const [dropdownTitle, setDropdownTitle] = useState('Dropdown');
  const [logoSrc, setLogoSrc] = useState(ProfileImage); // Default logo path

  useEffect(() => {
    if (isLoggedIn) {
      // Only get values from localStorage if the user is logged in
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

      if (user) {
        const username = user.username || 'Dropdown'; // Get username or fallback
        setDropdownTitle(username); // Set the dynamic title
      }

      // Get the logo path from localStorage
      const storedLogo = localStorage.getItem('logoImage');
      if (storedLogo) {
        setLogoSrc(storedLogo); // Update logo source if available
      }
    }
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      await Logout(); // Call the API logout
      localStorage.clear(); // Clear local storage
      sessionStorage.clear(); // Clear session storage
      logout(); // Update the auth context
      navigate("/"); // Redirect to the home page or login page
    } catch (error) {
      console.error('Error during logout:', error);
      // Optionally, display a message to the user
    }
  };

  // Early return after calling hooks, not before
  if (!isLoggedIn) {
    return null; // Hide the MenuBar if not logged in
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="#f67621">
      <Container>
      <Navbar.Brand>
          <img
            src={logoSrc} // Replace with your logo path
            alt="Logo"
            width="25"
            height="25"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        {/* Toggle Button for Mobile View */}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        {/* Collapsible Navbar Content */}
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown title={dropdownTitle} id="collasible-nav-dropdown">
              <NavDropdown.Item as={Link} to="/">Home</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/dashboard">Dashboard</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="#" onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
          </Nav>
          {/* <Nav>
            <Nav.Link as={Link} to="/more-deets">More Details</Nav.Link>
            <Nav.Link as={Link} to="/dank-memes">Dank Memes</Nav.Link>
            <Nav.Link href="#" onClick={handleLogout}>Logout</Nav.Link>
          </Nav> */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MenuBar;
