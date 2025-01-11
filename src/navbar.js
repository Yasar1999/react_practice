import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

function NavbarMenu() {
  return (
    <Navbar style={{ backgroundColor: '#f67621' }} expand="lg">
      <Container>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto" id="responsive-navbar-nav">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/size">Size</Nav.Link>
            <Nav.Link as={Link} to="/brands">Brand</Nav.Link>
            <Nav.Link as={Link} to="/category">Category</Nav.Link>
            <Nav.Link as={Link} to="/product">Product</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarMenu;
