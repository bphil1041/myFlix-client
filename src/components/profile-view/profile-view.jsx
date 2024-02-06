// Import statements
import React, { useState, useEffect } from "react";
import { Col, Row, Container, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./profile-view.scss";

// ProfileView component
export const ProfileView = ({ user, setUser }) => {
    // Destructure user object
    const { Username, Password, Email, Birthday } = user || {};

    // State variables
    const [isLoading, setIsLoading] = useState(false);

    // Navigation
    const navigate = useNavigate();

    // Token
    const token = localStorage.getItem('token');

    // Function to handle user information update
    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Perform the update logic here, for example, by making a PUT request to the server
            const updatedUserData = {
                Username: e.target.Username.value,
                Password: e.target.Password.value,
                Email: e.target.Email.value,
                Birthday: e.target.Birthday.value
            };

            const response = await fetch(`https://myflixbp-ee7590ef397f.herokuapp.com/users/${Username}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUserData),
            });

            if (response.ok) {
                alert("User information updated successfully");
                setUser(updatedUserData); // Update local state with new user data
            } else {
                alert("Failed to update user information");
            }
        } catch (error) {
            console.error("Update error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // JSX rendering of the component
    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="profile-title">User Information</h2>
                    {user ? (
                        <>
                            <p>Username: {user.Username}</p>
                            <p>Email: {user.Email}</p>
                            <p>Password: {user.Password}</p>
                            <p>Birthday: {user.Birthday}</p>
                        </>
                    ) : (
                        <p>No user information available.</p>
                    )}
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="profile-title">Update info</h2>
                    {/* User information update form */}
                    <Form className="my-profile" onSubmit={handleUpdate}>
                        {/* Form fields for name, password, email, and birthday */}
                        <Form.Group className="mb-2" controlId="formName">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="Username"
                                defaultValue={Username}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="formPassword">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                type="password"
                                name="Password"
                                defaultValue={Password}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="formEmail">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                name="Email"
                                defaultValue={Email}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBirthday">
                            <Form.Label>Birthday:</Form.Label>
                            <Form.Control
                                type="date"
                                name="Birthday"
                                defaultValue={Birthday}
                            />
                        </Form.Group>

                        {/* Update button */}
                        <Button
                            className="btn btn-primary update"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Updating...' : 'Update'}
                        </Button>
                    </Form>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col md={6}>
                    {/* Delete account button */}
                    <Button
                        className="btn btn-danger delete"
                        onClick={() => {
                            if (window.confirm("Are you sure you want to delete your account?")) {
                                setIsLoading(true);
                                fetch(`https://myflixbp-ee7590ef397f.herokuapp.com/users/${Username}`, {
                                    method: "DELETE",
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }).then((response) => {
                                    if (response.ok) {
                                        setUser(null);
                                        alert("Your account has been deleted");
                                    } else {
                                        alert("Something went wrong.")
                                    }
                                }).finally(() => {
                                    setIsLoading(false);
                                });
                            }
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Deleting...' : 'Delete Account'}
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};
