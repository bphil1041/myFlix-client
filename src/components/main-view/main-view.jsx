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
            Title: 'Twin Peaks: Fire Walk With Me',
            Description: 'Twin Peaks: Fire Walk with Me is a 1992 American psychological horror film directed by David Lynch and written by Lynch and Robert Engels. It serves as a prequel to the television series Twin Peaks, created by Mark Frost and Lynch, who were also executive producers. It revolves around the investigation into the murder of Teresa Banks (Pamela Gidley) and the last seven days in the life of Laura Palmer (Sheryl Lee), a popular high school student in the fictional Washington town of Twin Peaks. Unlike the series, which was an uncanny blend of detective fiction, horror, the supernatural, offbeat humor, and soap opera tropes, the film has a much darker, less humorous tone.',
            Genre: 'Surrealist',
            Director: 'David Lynch',
            image: 'https://m.media-amazon.com/images/M/MV5BMzc5ODcyNTYtMDAwNy00MDhjLWFmOWUtNGVhMDRlYjE1YzNjXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg'
        },
        {
            id: 3,
            Title: 'Good Will Hunting',
            Description: 'Good Will Hunting is a 1997 American psychological drama film directed by Gus Van Sant, and written by Ben Affleck and Matt Damon. It stars Robin Williams, Damon, Affleck, Stellan Skarsgård and Minnie Driver.',
            Genre: 'Drama',
            Director: 'Gus van Sant',
            image: 'https://m.media-amazon.com/images/M/MV5BOTI0MzcxMTYtZDVkMy00NjY1LTgyMTYtZmUxN2M3NmQ2NWJhXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg'
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
