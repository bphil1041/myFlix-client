import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Dropdown } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { ProfileView } from "../profile-view/profile-view";
import "./main-view.scss";


export const MainView = () => {
    const [movies, setMovies] = useState([]);
    const [user, setUser] = useState({
        Username: "",
        Password: "",
        Email: "",
        Birthday: "",
        favoriteMovies: [],
    });



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
                    image: movie.image,
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

    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedDirector, setSelectedDirector] = useState(null);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedDirectors, setSelectedDirectors] = useState([]);

    useEffect(() => {
        // Initialize selectedGenres with full list of genres
        setSelectedGenres([...new Set(movies.map(movie => movie.genre.genreName))]);
        // Initialize selectedDirectors with full list of directors
        setSelectedDirectors([...new Set(movies.map(movie => movie.director.name))]);
    }, [movies]);


    const handleGenreChange = (genreName) => {
        setSelectedGenre(genreName);
        // Filter unique directors based on selected genre
        const filteredDirectors = movies
            .filter(movie => !genreName || movie.genre.genreName === genreName)
            .map(movie => movie.director.name);
        setSelectedDirectors([...new Set(filteredDirectors)]);
    };
    const handleDirectorChange = (directorName) => {
        setSelectedDirector(directorName);
        // Filter unique genres based on selected director
        const filteredGenres = movies
            .filter(movie => !directorName || movie.director.name === directorName)
            .map(movie => movie.genre.genreName);
        setSelectedGenres([...new Set(filteredGenres)]);
    };

    const filteredMovies = movies.filter(movie => (
        (!selectedGenre || movie.genre.genreName === selectedGenre) &&
        (!selectedDirector || movie.director.name === selectedDirector)
    ));


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
                {user && movies.length > 0 && MainView > 1 && (
                    <>
                        <Col md={3}>
                            <Dropdown className="genre-filter">
                                <Dropdown.Toggle variant="primary" id="genre-filter-dropdown">
                                    {selectedGenre ? selectedGenre : "All Genres"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleGenreChange("")}>All Genres</Dropdown.Item>
                                    {selectedGenres.map(genre => (
                                        <Dropdown.Item key={genre} onClick={() => handleGenreChange(genre)}>{genre}</Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col md={3}>
                            <Dropdown className="director-filter">
                                <Dropdown.Toggle variant="primary" id="director-filter-dropdown">
                                    {selectedDirector ? selectedDirector : "All Directors"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleDirectorChange("")}>All Directors</Dropdown.Item>
                                    {selectedDirectors.map(director => (
                                        <Dropdown.Item key={director} onClick={() => handleDirectorChange(director)}>{director}</Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </>
                )}
            </Row>




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
                                    <ProfileView user={user} movies={movies} setUser={setUser} />
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
                                        {filteredMovies.map(movie => (
                                            <Col className="mb-5" key={movie._id} md={3}>
                                                <Link to={`/movies/${movie._id}`}>
                                                    <MovieCard movie={movie} image={movie.image} />
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
