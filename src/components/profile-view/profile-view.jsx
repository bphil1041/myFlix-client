import React, { useState, useEffect } from "react";
import { Col, Row, Container, Button, Form, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./profile-view.scss";

export const ProfileView = ({ user, setUser, movies }) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!user) {
                    console.error("User object is null or undefined.");
                    return;
                }

                console.log("Attempting to fetch user data. User:", user);

                const apiUrl = `https://myflixbp-ee7590ef397f.herokuapp.com/users/${user.Username}`;

                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const responseData = await response.json();

                console.log("Response body:", responseData);

                if (Array.isArray(responseData) && responseData.length > 0) {
                    const userData = responseData[0];

                    console.log("Parsed user data:", userData);

                    if (userData && typeof userData === "object") {
                        setUser({
                            Username: userData.Username || "",
                            Password: userData.Password || "",
                            Email: userData.Email || "",
                            Birthday: userData.Birthday
                                ? new Date(userData.Birthday).toISOString().split("T")[0]
                                : "",
                        });
                    } else {
                        console.error(
                            "Invalid user data structure received from the server:",
                            userData
                        );
                    }
                } else {
                    console.error("Empty or invalid response from the server");
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchUserData();
    }, [user, token, setUser]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(
                `https://myflixbp-ee7590ef397f.herokuapp.com/users/${user.Username}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(user),
                }
            );

            if (response.ok) {
                alert("User information updated successfully");
            } else {
                alert("Failed to update user information");
            }
        } catch (error) {
            console.error("Update error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://myflixbp-ee7590ef397f.herokuapp.com/users/${user.Username}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.ok) {
                    setUser(null);
                    alert("Your account has been deleted");
                } else {
                    alert("Failed to delete account");
                }
            } catch (error) {
                console.error("Delete account error:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSelectMovie = async (movieId) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://myflixbp-ee7590ef397f.herokuapp.com/users/${user.Username}/movies/${movieId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                alert("Movie added to favorites successfully");
            } else {
                alert("Failed to add movie to favorites");
            }
        } catch (error) {
            console.error("Add favorite movie error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveMovie = async (movieId) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://myflixbp-ee7590ef397f.herokuapp.com/users/${user.Username}/movies/${movieId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                alert("Movie removed from favorites successfully");
            } else {
                alert("Failed to remove movie from favorites");
            }
        } catch (error) {
            console.error("Remove favorite movie error:", error);
        } finally {
            setIsLoading(false);
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
                            <h3>Favorite Movies:</h3>
                            {user.FavoriteMovies.length > 0 ? (
                                <ul>
                                    {user.FavoriteMovies.map(movieId => {
                                        const movie = movies.find(m => m._id === movieId);
                                        return (
                                            <li key={movieId}>
                                                {movie ? movie.title : "Unknown Movie"}
                                                <Button variant="danger" onClick={() => handleRemoveMovie(movieId)}>Remove</Button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p>No favorite movies added</p>
                            )}
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
                                value={user.Username}
                                onChange={(e) =>
                                    setUser({ ...user, Username: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="formPassword">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your updated password"
                                value={user.Password}
                                onChange={(e) =>
                                    setUser({ ...user, Password: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="formEmail">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your updated email"
                                value={user.Email}
                                onChange={(e) =>
                                    setUser({ ...user, Email: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="formBirthday">
                            <Form.Label>Birthday:</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Select your updated birthday"
                                value={user.Birthday}
                                onChange={(e) =>
                                    setUser({ ...user, Birthday: e.target.value })
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
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col md={6}>
                    <Button
                        className="btn btn-danger delete"
                        onClick={handleDeleteAccount}
                        disabled={isLoading}
                    >
                        {isLoading ? "Deleting..." : "Delete Account"}
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};
