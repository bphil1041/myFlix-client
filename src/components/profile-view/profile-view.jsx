import React, { useState, useEffect } from "react";
import { Col, Row, Container, Button, Form, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./profile-view.scss";

export const ProfileView = ({ user, setUser, movies }) => {
    const [updatedUser, setUpdatedUser] = useState({
        Username: "",
        Password: "",
        Email: "",
        Birthday: "",
        FavoriteMovies: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // Log the user state
    console.log("User State:", user);

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

                console.log("API URL:", apiUrl);

                console.log("Response body:", responseData);

                if (Array.isArray(responseData) && responseData.length > 0) {
                    const userData = responseData[0];

                    console.log("Parsed user data:", userData);

                    // Check if the fetched user data matches the logged-in user
                    if (userData.Username === user.Username) {
                        setUser({
                            Username: userData.Username || "",
                            Password: userData.Password || "",
                            Email: userData.Email || "",
                            Birthday: userData.Birthday
                                ? new Date(userData.Birthday).toISOString().split("T")[0]
                                : "",
                            FavoriteMovies: userData.FavoriteMovies || []
                        });
                        setUpdatedUser({
                            Username: userData.Username || "",
                            Password: userData.Password || "",
                            Email: userData.Email || "",
                            Birthday: userData.Birthday
                                ? new Date(userData.Birthday).toISOString().split("T")[0]
                                : "",
                            FavoriteMovies: userData.FavoriteMovies || []
                        });
                    } else {
                        console.error("Fetched user data does not match the logged-in user:", userData);
                    }
                } else {
                    console.error("Empty or invalid response from the server");
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchUserData();
    }, [user, token]);

    // Save user to localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }, [user]);

    // Retrieve user from localStorage on page load
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);




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
                    body: JSON.stringify(updatedUser),
                }
            );

            if (response.ok) {
                alert("User information updated successfully");
                setUser(updatedUser);
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
        try {
            const response = await fetch(
                `https://myflixbp-ee7590ef397f.herokuapp.com/users/${user.Username}/movies/${movieId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                }
            );

            if (response.ok) {
                // Fetch user data again to get the updated favorite movies list
                const updatedUserData = await response.json();
                console.log("Updated user data:", updatedUserData);
                // Update the updatedUser state with the updated user data
                setUpdatedUser(updatedUserData);
                alert("Movie added to favorites successfully");
            } else {
                alert("Failed to add movie to favorites");
            }
        } catch (error) {
            console.error("Add movie to favorites error:", error);
        }
    };

    const handleDeleteMovie = async (movieId) => {
        // Remove movie from frontend UI list
        setUpdatedUser(prevUser => ({
            ...prevUser,
            FavoriteMovies: prevUser.FavoriteMovies.filter(id => id !== movieId)
        }));

        try {
            // Send DELETE request to remove movie from backend
            const response = await fetch(
                `https://myflixbp-ee7590ef397f.herokuapp.com/users/${user.Username}/movies/${movieId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            if (response.ok) {
                alert("Movie removed from favorites successfully");
            } else {
                alert("Failed to remove movie from favorites");
            }
        } catch (error) {
            console.error("Delete movie from favorites error:", error);
        }
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="profile-title">User Information</h2>
                    {user ? (
                        <>
                            <p className="user-content">Username: {user.Username}</p>
                            <p className="user-content">Email: {user.Email}</p>
                            <p className="user-content">Birthday: {user.Birthday}</p>
                            <p className="user-content">Favorite Movies: </p>
                            <ul>
                                {user.FavoriteMovies && user.FavoriteMovies.length > 0 ? (
                                    user.FavoriteMovies.map(movieId => {
                                        const movie = movies.find(movie => movie._id === movieId);
                                        return (
                                            <li className="user-content" key={movieId}>
                                                {movie ? `${movie.title} (${movie.year})` : 'Movie not found'}
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="ml-2 border-white"
                                                    onClick={() => handleDeleteMovie(movieId)}
                                                >
                                                    Delete
                                                </Button>
                                            </li>
                                        );
                                    })
                                ) : (
                                    <li className="user-content">No favorite movies found</li>
                                )}
                            </ul>
                            <Dropdown>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                    Add Favorite Movie
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {movies.length > 0 ? (
                                        movies.map(movie => (
                                            <Dropdown.Item
                                                key={movie._id}
                                                onClick={() => handleSelectMovie(movie._id)}
                                            >
                                                {movie.title} ({movie.year})
                                            </Dropdown.Item>
                                        ))
                                    ) : (
                                        <Dropdown.Item disabled>No movies available</Dropdown.Item>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
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
                            <Form.Label className="user-content">Username:</Form.Label>
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
                            <Form.Label className="user-content">Password:</Form.Label>
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
                            <Form.Label className="user-content">Email:</Form.Label>
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
                            <Form.Label className="user-content">Birthday:</Form.Label>
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
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col md={6}>
                    <Button
                        className="btn btn-danger delete border-white"
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
