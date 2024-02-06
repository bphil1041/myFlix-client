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
                const apiUrl = `https://myflixbp-ee7590ef397f.herokuapp.com/users/${user.Username}`;

                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const responseData = await response.text();

                // Log the response for debugging
                console.log('Response body:', responseData);

                // Check if the response is not empty and is a valid JSON
                if (responseData && responseData.trim() !== '') {
                    const userData = JSON.parse(responseData);

                    // Log the parsed user data for debugging
                    console.log('Parsed user data:', userData);

                    // Ensure userData is an object
                    if (userData && typeof userData === 'object') {
                        setUsername(userData.Username || '');
                        setPassword(userData.Password || '');
                        setEmail(userData.Email || '');
                        setBirthday(userData.Birthday ? new Date(userData.Birthday).toISOString().split('T')[0] : '');
                    } else {
                        console.error('Invalid user data structure received from the server:', userData);
                    }
                } else {
                    console.error('Empty or invalid JSON response from the server');
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchUserData();
    }, [user, token]);


    // Delete user account
    const handleDelete = () => {
        setIsLoading(true);

        fetch(`https://myflixbp-ee7590ef397f.herokuapp.com/users/${user.Username}`, {
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

    // Function to handle user information update
    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Perform the update logic here, for example, by making a PUT request to the server
            const updatedUserData = {
                Username: username,
                Password: password,
                Email: email,
                Birthday: birthday
            };

            const response = await fetch(`https://myflixbp-ee7590ef397f.herokuapp.com/users/${user.Username}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUserData),
            });

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
