import React from "react";
import PropTypes from "prop-types";

export const MovieView = ({ movie, onBackClick }) => {
    return (
        <div>
            <div>
                <img src={movie.image} alt={movie.title} />
            </div>
            <div>
                <span>Title: </span>
                <span>{movie.title}</span>
            </div>
            <div>
                <span>Description: </span>
                <span>{movie.description}</span>
            </div>
            <div>
                <span>Release Year: </span>
                <span>{movie.year}</span>
            </div>
            <div>
                <span>Genre: </span>
                <span>{movie.genre.genreName}</span>
            </div>
            <div>
                <span>Genre Description: </span>
                <span>{movie.genre.description}</span>
            </div>
            <div>
                <span>Director: </span>
                <span>{movie.director.name}</span>
            </div>
            <div>
                <span>Born: </span>
                <span>{movie.director.birth}</span>
            </div>
            <div>
                <span>Died: </span>
                <span>{movie.director.death}</span>
            </div>
            <div>
                <span>Bio: </span>
                <span>{movie.director.bio}</span>
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
