import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar.jsx";
import { ProfileView } from "../../profile-view/profile-view";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import "./main-view.scss";

export const MainView = () => {
    const [movies, setMovies] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        console.log("Token from localStorage in MainView:", token);

        if (!token) {
            console.log("No token found. Redirect to login or handle accordingly");
            return;
        }

        console.log("Before fetch");

        fetch("https://myflixbp-ee7590ef397f.herokuapp.com/movies", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                console.log("API Response Status:", response.status);

                if (!response.ok) {
                    throw new Error("Unauthorized");
                }

                return response.json();
            })
            .then((data) => {
                console.log("Movies data from API:", data);

                const moviesFromApi = data.map((movie) => ({
                    genre: {
                        genreName: movie.genre.genreName,
                        description: movie.genre.description,
                    },
                    director: {
                        name: movie.director.name,
                        birth: movie.director.birth,
                        death: movie.director.death,
                        bio: movie.director.bio,
                    },
                    _id: movie._id,
                    title: movie.title,
                    year: movie.year,
                    description: movie.description,
                    MovieId: movie.MovieId,
                }));

                console.log("Movies after mapping:", moviesFromApi);

                setMovies(moviesFromApi);
            })
            .catch((error) => {
                console.error("Error fetching movies:", error);

                if (error.message === "Unauthorized") {
                    console.log("Unauthorized access. Redirect to login or handle accordingly");
                }
            });

        console.log("After fetch");
    }, []);

    return (
        <BrowserRouter>
            <NavigationBar
                className="navbar"
                user={user}
                onLoggedOut={() => {
                    setUser(null);
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }}
            />

            <Row className="justify-content-md-center">
                <Routes>
                    <Route
                        path="/signup"
                        element={
                            <>
                                {user ? (
                                    <Navigate to="/" />
                                ) : (
                                    <Col md={5}>
                                        <SignupView />
                                    </Col>
                                )}
                            </>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <>
                                {user ? (
                                    <Navigate to="/" />
                                ) : (
                                    <Col md={5}>
                                        <LoginView onLoggedIn={(user) => setUser(user)} />
                                    </Col>
                                )}
                            </>
                        }
                    />
                    <Route
                        path="/movies/:movieId"
                        element={<MovieView movies={movies} />}
                    />
                    <Route
                        path="/profile"
                        element={
                            <>
                                {user ? (
                                    <ProfileView user={user} />
                                ) : (
                                    <Navigate to="/login" replace />
                                )}
                            </>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <>
                                {!user ? (
                                    <Navigate to="/login" replace />
                                ) : movies.length === 0 ? (
                                    <Col>The list is empty!</Col>
                                ) : (
                                    <>
                                        {movies.map((movie) => (
                                            <Col className="mb-5" key={movie._id} md={3}>
                                                <Link to={`/movies/${movie._id}`}>
                                                    <MovieCard movie={movie} />
                                                </Link>
                                            </Col>
                                        ))}
                                    </>
                                )}
                            </>
                        }
                    />
                </Routes>
            </Row>
        </BrowserRouter>
    );
};
