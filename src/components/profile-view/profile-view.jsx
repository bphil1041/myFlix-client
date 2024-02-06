import React, { useState, useEffect } from "react";
import { Col, Row, Container, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./profile-view.scss";

export const ProfileView = ({ user, setUser }) => {
    const [updatedUser, setUpdatedUser] = useState({
        Username: "",
        Password: "",
        Email: "",
        Birthday: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setUpdatedUser({
            Username: user?.Username || "",
            Password: user?.Password || "",
            Email: user?.Email || "",
            Birthday: user?.Birthday || "",
        });
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simulate update request
            setTimeout(() => {
                setUser(updatedUser);
                setIsLoading(false);
                alert("User information updated successfully");
            }, 1000);
        } catch (error) {
            console.error("Update error:", error);
            setIsLoading(false);
            alert("Failed to update user information");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            setIsLoading(true);
            try {
                const response = await fetch(`https://myflixbp-ee7590ef397f.herokuapp.com/users/${user.Username}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    setUser(null);
                    alert("Your account has been deleted");
                } else {
                    alert("Failed to delete account");
                }
            } catch (error) {
                console.error("Delete error:", error);
                alert("Failed to delete account");
            } finally {
                setIsLoading(false);
            }
        }
    };

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
                        <p>Loading user information...</p>
                    )}
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="profile-title">Update User Information</h2>
                    <Form className="my-profile" onSubmit={handleUpdate}>
                        <Form.Group className="mb-2" controlId="formName">
                            <Form.Label>Username:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your updated username"
                                value={updatedUser.Username}
                                onChange={(e) =>
                                    setUpdatedUser({ ...updatedUser, Username: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="formPassword">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your updated password"
                                value={updatedUser.Password}
                                onChange={(e) =>
                                    setUpdatedUser({ ...updatedUser, Password: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="formEmail">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your updated email"
                                value={updatedUser.Email}
                                onChange={(e) =>
                                    setUpdatedUser({ ...updatedUser, Email: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="formBirthday">
                            <Form.Label>Birthday:</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Select your updated birthday"
                                value={updatedUser.Birthday}
                                onChange={(e) =>
                                    setUpdatedUser({ ...updatedUser, Birthday: e.target.value })
                                }
                            />
                        </Form.Group>

                        <Button
                            className="btn btn-primary update"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Updating..." : "Update"}
                        </Button>
                    </Form>

                    {/* Delete account button */}
                    <Button
                        className="btn btn-danger delete"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        {isLoading ? "Deleting..." : "Delete Account"}
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};
