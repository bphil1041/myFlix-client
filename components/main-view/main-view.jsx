import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
    const [movies, setMovies] = useState([
        {
            id: 1,
            Title: 'Mulholland Drive',
            Description: 'Mulholland Drive (stylized as Mulholland Dr.) is a 2001 surrealist neo-noir mystery film written and directed by David Lynch, and starring Naomi Watts, Laura Harring, Justin Theroux, Ann Miller, Mark Pellegrino and Robert Forster. It tells the story of an aspiring actress named Betty Elms (Watts), newly arrived in Los Angeles, who meets and befriends an amnesiac woman (Harring) recovering from a car accident. The story follows several other vignettes and characters, including a Hollywood film director (Theroux).',
            Genre: 'Surrealist',
            Director: 'David Lynch',
            image: 'https://m.media-amazon.com/images/M/MV5BYTRiMzg4NDItNTc3Zi00NjBjLTgwOWYtOGZjMTFmNGU4ODY4XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg'
        },
        {
            id: 2,
            Title: 'Mulholland Drive',
            Description: 'Mulholland Drive (stylized as Mulholland Dr.) is a 2001 surrealist neo-noir mystery film written and directed by David Lynch, and starring Naomi Watts, Laura Harring, Justin Theroux, Ann Miller, Mark Pellegrino and Robert Forster. It tells the story of an aspiring actress named Betty Elms (Watts), newly arrived in Los Angeles, who meets and befriends an amnesiac woman (Harring) recovering from a car accident. The story follows several other vignettes and characters, including a Hollywood film director (Theroux).',
            Genre: 'Surrealist',
            Director: 'David Lynch',
            image: 'https://m.media-amazon.com/images/M/MV5BYTRiMzg4NDItNTc3Zi00NjBjLTgwOWYtOGZjMTFmNGU4ODY4XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg'
        },
        {
            id: 3,
            Title: 'Mulholland Drive',
            Description: 'Mulholland Drive (stylized as Mulholland Dr.) is a 2001 surrealist neo-noir mystery film written and directed by David Lynch, and starring Naomi Watts, Laura Harring, Justin Theroux, Ann Miller, Mark Pellegrino and Robert Forster. It tells the story of an aspiring actress named Betty Elms (Watts), newly arrived in Los Angeles, who meets and befriends an amnesiac woman (Harring) recovering from a car accident. The story follows several other vignettes and characters, including a Hollywood film director (Theroux).',
            Genre: 'Surrealist',
            Director: 'David Lynch',
            image: 'https://m.media-amazon.com/images/M/MV5BYTRiMzg4NDItNTc3Zi00NjBjLTgwOWYtOGZjMTFmNGU4ODY4XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg'
        },
    ]);

    const [selectedMovie, setSelectedMovie] = useState(null);

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
                    key={movie.id}
                    movie={movie}
                    onMovieClick={(newSelectedMovie) => {
                        setSelectedMovie(newSelectedMovie);
                    }}
                />
            ))}
        </div>
    );
}
