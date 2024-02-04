import React from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

export const MovieView = ({ movies, onBackClick }) => {
    const { movieId } = useParams();
    const selectedMovie = movies.find(movie => movie._id === movieId);

    if (!selectedMovie) {
        // Handle the case where the movie with the given movieId is not found
        return <div>Movie not found</div>;
    }

    return (
        <div>
            <div>
                <img src={selectedMovie.image} alt={selectedMovie.title} />
            </div>
            <div>
                <span>Title: </span>
                <span>{selectedMovie.title}</span>
            </div>
            <div>
                <span>Description: </span>
                <span>{selectedMovie.description}</span>
            </div>
            <div>
                <span>Release Year: </span>
                <span>{selectedMovie.year}</span>
            </div>
            <div>
                <span>Genre: </span>
                <span>{selectedMovie.genre.genreName}</span>
            </div>
            <div>
                <span>Genre Description: </span>
                <span>{selectedMovie.genre.description}</span>
            </div>
            <div>
                <span>Director: </span>
                <span>{selectedMovie.director.name}</span>
            </div>
            <div>
                <span>Born: </span>
                <span>{selectedMovie.director.birth}</span>
            </div>
            <div>
                <span>Died: </span>
                <span>{selectedMovie.director.death}</span>
            </div>
            <div>
                <span>Bio: </span>
                <span>{selectedMovie.director.bio}</span>
            </div>
            <button onClick={onBackClick}>Back</button>
        </div>
    );
};

MovieView.propTypes = {
    movie: PropTypes.shape({
        image: PropTypes.string,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        genre: PropTypes.shape({
            genreName: PropTypes.string,
            description: PropTypes.string,
        }),
        director: PropTypes.shape({
            name: PropTypes.string,
            birth: PropTypes.string,
            death: PropTypes.string,
            bio: PropTypes.string,
        }),
        _id: PropTypes.string.isRequired,
        MovieId: PropTypes.string,
        year: PropTypes.number,
    }).isRequired,
    onBackClick: PropTypes.func.isRequired,
};
