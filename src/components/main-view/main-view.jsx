import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        fetch("https://myflixbp-ee7590ef397f.herokuapp.com/movies")
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response:", data);

                if (data.docs && Array.isArray(data.docs)) {
                    const moviesFromApi = data.docs.map((doc) => {
                        return {
                            genre: {
                                genreName: doc.genre.genreName,
                                description: doc.genre.description,
                            },
                            director: {
                                name: doc.director.name,
                                birth: doc.director.birth,
                                death: doc.director.death,
                                bio: doc.director.bio,
                            },
                            _id: doc._id,
                            title: doc.title,
                            year: doc.year,
                            description: doc.description,
                            MovieId: doc.MovieId,
                        };
                    });

                    setMovies(moviesFromApi);
                }
            })
            .catch((error) => {
                console.error("Error fetching movies:", error);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }


    if (selectedMovie) {
        return (
            <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
        );
    }

    if (movies.length === 0) {
        return <div>The list is empty!</div>;
    }

    return (
        <div>
            {movies.map((movie) => (
                <MovieCard
                    key={movie._id}
                    movie={movie}
                    onMovieClick={(newSelectedMovie) => {
                        setSelectedMovie(newSelectedMovie);
                    }}
                />
            ))}
        </div>
    );
}