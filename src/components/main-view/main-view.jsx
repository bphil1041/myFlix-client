import { useState } from "react";
import { useEffect } from "react";
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
                    const moviesFromApi = data.map((movie) => {
                        return {
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
                        };
                    });

                    setMovies(moviesFromApi);
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error("Error fetching movies:", error);
                setLoading(false);
            });
    }, []);

    console.log("Movies:", movies);

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
            {movies.map(({ _id, ...movie }) => (
                <MovieCard
                    key={_id}
                    movie={movie}
                    onMovieClick={(newSelectedMovie) => {
                        setSelectedMovie(newSelectedMovie);
                    }}
                />
            ))}
        </div>
    );

}
