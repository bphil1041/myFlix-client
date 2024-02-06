// Import statements
import React, { useState, useEffect } from "react";
import { Col, Row, Container, Button, Form } from "react-bootstrap";
import { MovieCard } from "../movie-card/movie-card";
import { useNavigate } from "react-router-dom";
import "./profile-view.scss";

// ProfileView component
export const ProfileView = ({ user, movies, setUser }) => {
    // State variables
    const [username, setUsername] = useState(user?.Username || '');
    const [password, setPassword] = useState(user?.Password || '');
    const [email, setEmail] = useState(user?.Email || '');
    const [birthday, setBirthday] = useState(user?.Birthday || '');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMovieId, setSelectedMovieId] = useState('');
    const [selectedMovie, setSelectedMovie] = useState(null); // New state to store selected movie details

    // Navigation
    const navigate = useNavigate();

    // Token 
    const token = localStorage.getItem('token');

    // Return movies present in the user's favorite movies array
    const favoriteMovies = user.favoriteMovies && movies
        ? user.favoriteMovies.map((movieId) => {
            const foundMovie = movies.find((m) => m._id === movieId);
            if (!foundMovie) {
                console.log(`Movie with ID ${movieId} not found in the movies array.`);
            }
            return foundMovie;
        })
        : [];

    console.log("User:", user);
    console.log("Movies:", movies);
    console.log("Favorite Movies:", favoriteMovies);

    // ...

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!user) {
                    console.error('User object is null or undefined.');
                    return;
                }

                console.log("Attempting to fetch user data. User:", user);

                // Your Heroku backend API URL
                const apiUrl = `https://myflixbp-ee7590ef397f.herokuapp.com/users/${user.Username}`;

                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const userData = await response.json();

                    if (Array.isArray(userData) && userData.length > 0) {
                        // Assuming you want to display the details of the first user in the array
                        const firstUser = userData[0];
                        setUsername(firstUser.Username || '');
                        setPassword(firstUser.Password || '');
                        setEmail(firstUser.Email || '');
                        setBirthday(firstUser.Birthday ? new Date(firstUser.Birthday).toISOString().split('T')[0] : '');
                    } else {
                        console.error('Invalid user data structure received from the server.');
                    }
                } else {
                    console.error(`Failed to fetch user data. Status: ${response.status}`);
                    const errorData = await response.json();
                    console.error("Error response from server:", errorData);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchUserData();
    }, [user, setUser]);

    // Update user information
    const handleUpdate = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            // Gather updated user data
            const data = {
                Username: username,
                Password: password,
                Email: email,
                Birthday: birthday,
            };

            // Fetch request to update user data
            const response = await fetch(`https://myflixbp-ee7590ef397f.herokuapp.com/users/${user.Username}`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                    Authorization: `Bearer ${token}`, // Assuming token is defined
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const updatedUserData = await response.json();
                localStorage.setItem('user', JSON.stringify(updatedUserData));
                setUser(updatedUserData);

                // Update the local state with the new user data
                setUsername(updatedUserData.Username || '');
                setPassword(updatedUserData.Password || '');
                setEmail(updatedUserData.Email || '');
                setBirthday(updatedUserData.Birthday ? new Date(updatedUserData.Birthday).toISOString().split('T')[0] : '');

                alert('Updated!');
            } else {
                const error = await response.text();
                console.error('Update failed:', error);
                alert('Update failed. Please try again.');
            }
        } catch (error) {
            console.error('Update failed:', error);
            alert('Update failed. Please try again.');
        } finally {
            setIsLoading(false);
        }

        // Navigate to the selected movie's details page
        if (selectedMovieId) {
            navigate(`/movies/${selectedMovieId}`);
        }
    };

    // Delete user account
    const handleDelete = () => {
        setIsLoading(true);

        fetch(`https://myflixbp-ee7590ef397f.herokuapp.com/users/${user.username}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`, // Assuming token is defined
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
    const addFavoriteMovie = () => {
        console.log("Selected Movie ID:", selectedMovieId);
        console.log("User Favorite Movies:", user.favoriteMovies);

        if (selectedMovieId && user.favoriteMovies) {
            // Check if the movie is not already in the user's favorites
            if (!user.favoriteMovies.includes(selectedMovieId)) {
                const updatedUser = { ...user, favoriteMovies: [...user.favoriteMovies, selectedMovieId] };
                setUser(updatedUser);

                // You can also update the user data on the server if needed
                // Example: call an API endpoint to update the user's favorite movies list

                // Clear the selectedMovieId for the next selection
                setSelectedMovieId('');
            } else {
                // Handle case when the movie is already in the user's favorites
                alert('This movie is already in your favorites!');
            }
        } else {
            // Handle case when no movie is selected or user.favoriteMovies is undefined
            alert('Please select a movie to add to favorites.');
        }
    };

    // Common function to handle movie card click
    const handleMovieCardClick = (movie) => {
        // Navigate to the movie details page
        navigate(`/movies/${movie._id}`);
    };

    // Retrieve favorite movies from local storage on component mount
    useEffect(() => {
        const storedFavorites = localStorage.getItem('userFavorites');
        if (storedFavorites) {
            const parsedFavorites = JSON.parse(storedFavorites);
            setUser((prevUser) => ({ ...prevUser, favoriteMovies: parsedFavorites }));
        }
    }, []); // Empty dependency array ensures this effect runs only once on mount

    // Save favorite movies to local storage whenever the user's favorites change
    useEffect(() => {
        localStorage.setItem('userFavorites', JSON.stringify(user.favoriteMovies));
    }, [user.favoriteMovies]);

    // JSX rendering of the component
    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="profile-title">User Information</h2>
                    {user ? (
                        <>
                            <p>Username: {user.Username}</p>
                            <p>Email: {user.email}</p>
                            <p>Password: {user.password}</p>
                            <p>Birthday: {user.birthday}</p>
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
                    {favoriteMovies.length > 0 ? (
                        favoriteMovies.map((movie) => (
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
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="formPassword">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="formEmail">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formBirthday">
                            <Form.Label>Birthday:</Form.Label>
                            <Form.Control
                                type="date"
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                                required
                            />
                        </Form.Group>

                        {/* Update and delete buttons */}
                        <Button
                            className="btn btn-primary update"
                            type="submit"
                            onClick={handleUpdate}
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

