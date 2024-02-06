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
    const [updatedUser, setUpdatedUser] = useState({ Username, Password, Email, Birthday });
    const [isLoading, setIsLoading] = useState(false);

    // Navigation
    const navigate = useNavigate();

    // Token
    const token = localStorage.getItem('token');

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!user) {
                    console.error('User object is null or undefined.');
                    return;
                }

                console.log("Attempting to fetch user data. User:", user);

                // Correct API URL for user data
                const apiUrl = `https://myflixbp-ee7590ef397f.herokuapp.com/users/${Username}`;

                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const responseData = await response.json();

                // Log the response for debugging
                console.log('Response body:', responseData);

                if (Array.isArray(responseData) && responseData.length > 0) {
                    // Take the first user from the array
                    const userData = responseData[0];

                    // Log the parsed user data for debugging
                    console.log('Parsed user data:', userData);

                    // Ensure userData is an object
                    if (userData && typeof userData === 'object') {
                        setUser({
                            Username: userData.Username || '',
                            Password: userData.Password || '',
                            Email: userData.Email || '',
                            Birthday: userData.Birthday ? new Date(userData.Birthday).toISOString().split('T')[0] : ''
                        });
                    } else {
                        console.error('Invalid user data structure received from the server:', userData);
                    }
                } else {
                    console.error('Empty or invalid response from the server');
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchUserData();
    }, [user, token, setUser]);

    // Function to handle user information update
    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`https://myflixbp-ee7590ef397f.herokuapp.com/users/${Username}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUser),
            });

            if (response.ok) {
                alert("User information updated successfully");
                setUser(updatedUser); // Update local state with new user data
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
                                value={updatedUser.Username}
                                onChange={(e) => setUpdatedUser({ ...updatedUser, Username: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="formPassword">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                type="password"
                                value={updatedUser.Password}
                                onChange={(e) => setUpdatedUser({ ...updatedUser, Password: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="formEmail">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                value={updatedUser.Email}
                                onChange={(e) => setUpdatedUser({ ...updatedUser, Email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBirthday">
                            <Form.Label>Birthday:</Form.Label>
                            <Form.Control
                                type="date"
                                value={updatedUser.Birthday}
                                onChange={(e) => setUpdatedUser({ ...updatedUser, Birthday: e.target.value })}
                            />
                        </Form.Group>

                        {/* Update and delete buttons */}
                        <Button
                            className="btn btn-primary update"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Updating...' : 'Update'}
                        </Button>
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
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};
