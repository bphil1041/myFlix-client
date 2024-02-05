import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./navigation-bar.scss";

export const NavigationBar = ({ user, onLoggedOut }) => {
    return (
        <Navbar className="navbarmain" bg="primary" expand="lg" fixed="top">
            <Container>
                <Navbar.Brand className="nav-title" as={Link} to="/">
                    myFlix
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {!user ? (
                            <>
                                <Nav.Link className="navlink" as={Link} to="/login">
                                    Login
                                </Nav.Link>
                                <Nav.Link className="navlink" as={Link} to="/signup">
                                    Signup
                                </Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link className="navlink" as={Link} to="/">
                                    Home
                                </Nav.Link>
                                <Nav.Link className="navlink" as={Link} to="/profile">
                                    Profile
                                </Nav.Link>
                                <Nav.Link className="navlink" onClick={onLoggedOut}>Logout</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
