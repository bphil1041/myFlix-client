// Import statements
import React, { useState, useEffect } from "react";
import { Col, Row, Container, Button, Form } from "react-bootstrap";
import { MovieCard } from "../movie-card/movie-card";
import { useNavigate } from "react-router-dom";
import "./profile-view.scss";

// ProfileView component
export const ProfileView = ({ user, movies, setUser }) => {
    // Destructure user object
    const { Username, Password, Email, Birthday, favoriteMovies = [] } = user || {};

    // State variables
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMovieId, setSelectedMovieId] = useState('');

    // Navigation
    const navigate = useNavigate();

    // Token
    const token = localStorage.getItem('token');

    // Return movies present in the user's favorite movies array
    const favoriteMoviesData = favoriteMovies.map((movieId) => movies.find((m) => m._id === movieId));

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!user) {
                    console.error('User object is null or undefined.');
                    return;
                }

                const apiUrl = `https://myflixbp-ee7590ef397f.herokuapp.com/users/${Username}`;

                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const responseData = await response.json();

                if (Array.isArray(responseData) && responseData.length > 0) {
                    const userData = responseData[0];

                    if (userData && typeof userData === 'object') {
                        setUser({
                            Username: userData.Username || '',
                            Password: userData.Password || '',
                            Email: userData.Email || '',
                            Birthday: userData.Birthday ? new Date(userData.Birthday).toISOString().split('T')[0] : '',
                            favoriteMovies: userData.favoriteMovies || []
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

    // Delete user account
    const handleDelete = () => {
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
    };

    // Add a movie to the user's favorite movies
    const addFavoriteMovie = async () => {
        if (selectedMovieId) {
            try {
                const response = await fetch(`https://myflixbp-ee7590ef397f.herokuapp.com/users/${Username}/movies/${selectedMovieId}`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const updatedUser = await response.json();
                    setUser(updatedUser);

                    // Clear the selectedMovieId for the next selection
                    setSelectedMovieId('');

                    alert('Movie added to favorites successfully!');
                } else {
                    alert('Failed to add movie to favorites. Please try again.');
                }
            } catch (error) {
                console.error('Add favorite movie error:', error);
            }
        } else {
            alert('Please select a movie to add to favorites.');
        }
    };

    // Common function to handle movie card click
    const handleMovieCardClick = (movie) => {
        navigate(`/movies/${movie._id}`);
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
                    <h2>Favorite Movies</h2>
                    {/* Render favorite movies */}
                    {favoriteMoviesData.length > 0 ? (
                        favoriteMoviesData.map((movie) => (
                            <Col
                                key={movie._id}
                                className="m-3"
                            >
                                <MovieCard
                                    movie={movie}
                                    onMovieClick={() => handleMovieCardClick(movie)}
                                />
                            </Col>
                        ))
                    ) : (
                        <p>No favorite movies yet.</p>
                    )}
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="profile-title">Add to Favorites</h2>
                    <Form>
                        <Form.Group controlId="selectMovie">
                            <Form.Label>Select a Movie:</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedMovieId}
                                onChange={(e) => setSelectedMovieId(e.target.value)}
                            >
                                <option value="" disabled>Select a movie</option>
                                {movies.map((movie) => (
                                    <option key={movie._id} value={movie._id}>{movie.title}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Button
                            variant="primary"
                            onClick={addFavoriteMovie}
                            disabled={isLoading}
                        >
                            Add to Favorites
                        </Button>
                    </Form>
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
                                value={Username}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="formPassword">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                type="password"
                                value={Password}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="formEmail">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                value={Email}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group controlId="formBirthday">
                            <Form.Label>Birthday:</Form.Label>
                            <Form.Control
                                type="date"
                                value={Birthday}
                                disabled
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
                            onClick={handleDelete}
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
