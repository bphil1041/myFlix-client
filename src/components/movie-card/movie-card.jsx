import PropTypes from "prop-types";

export const MovieCard = ({ movie, onMovieClick }) => {
    return (
        <div
            onClick={() => {
                onMovieClick(movie);
            }}
        >
            {movie.title}
        </div>
    );
};

MovieCard.propTypes = {
    movie: PropTypes.shape({
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
        title: PropTypes.string.isRequired,
        year: PropTypes.string,
        description: PropTypes.string,
        MovieId: PropTypes.string,
    }).isRequired,
    onMovieClick: PropTypes.func.isRequired,
};
