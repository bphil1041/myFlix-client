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

        if (!token) {
            return;
        }

        fetch("https://myflixbp-ee7590ef397f.herokuapp.com/movies", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Unauthorized");
                }

                return response.json();
            })
            .then((data) => {
                const moviesFromApi = data.map((movie) => ({
                    // Your movie data transformation logic here
                }));

                setMovies(moviesFromApi);
            })
            .catch((error) => {
                console.error("Error fetching movies:", error);

                if (error.message === "Unauthorized") {
                    console.log("Unauthorized access. Redirect to login or handle accordingly");
                }
            });
    }, []);

    return (
        <BrowserRouter>
            <NavigationBar
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
                                    <Col md={8}>
                                        <ProfileView
                                            user={user}
                                            movies={movies}
                                            setUser={setUser}
                                            removeFav={removeFav}
                                            addFav={addFav}
                                        />
                                    </Col>
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
