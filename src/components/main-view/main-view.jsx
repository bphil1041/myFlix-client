import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar.jsx";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

export const MainView = () => {
    const [movies, setMovies] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch("https://myflixbp-ee7590ef397f.herokuapp.com/movies")
            .then((response) => response.json())
            .then((data) => {
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

                setMovies(moviesFromApi);
            })
            .catch((error) => {
                console.error("Error fetching movies:", error);
            });
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Row className="justify-content-md-center">
                            {!user ? (
                                <Col md={5}>
                                    <LoginView
                                        onLoggedIn={(user, token) => {
                                            setUser(user);
                                            // setToken(token); // Assuming setToken is defined somewhere
                                        }}
                                    />
                                    or
                                    <SignupView />
                                </Col>
                            ) : movies.length === 0 ? (
                                <Col md={5}>
                                    <div>The list is empty!</div>
                                </Col>
                            ) : (
                                <>
                                    {movies.map(({ _id, ...movie }) => (
                                        <Col className="mb-5" key={_id} md={3}>
                                            <Link to={`/movies/${_id}`}>
                                                <MovieCard movie={movie} />
                                            </Link>
                                        </Col>
                                    ))}
                                </>
                            )}
                        </Row>
                    }
                />
                <Route
                    path="/movies/:movieId"
                    element={<MovieDetailView movies={movies} />}
                />
            </Routes>
        </BrowserRouter>
    );
};

const MovieDetailView = ({ movies }) => {
    // Extract movieId from the URL
    const { movieId } = useParams();

    // Find the selected movie
    const selectedMovie = movies.find((movie) => movie._id === movieId);

    if (!selectedMovie) {
        return <div>Movie not found</div>;
    }

    return (
        <Col md={8} style={{ border: "1px solid black" }}>
            <MovieView movie={selectedMovie} />
        </Col>
    );
};
