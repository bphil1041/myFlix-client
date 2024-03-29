import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";

export const MovieCard = ({ movie, onMovieClick, image }) => {
    return (
        <Card className="h-100 border-ridge">
            <Card.Img variant="top" src={image} alt={movie.title} />
            <Card.Body>
                <Card.Title className="card-title text-center">{movie.title}</Card.Title>
                <Button onClick={() => onMovieClick(movie)} variant="link"></Button>
            </Card.Body>
        </Card>
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
        year: PropTypes.number,
        description: PropTypes.string,
        MovieId: PropTypes.string,
    }).isRequired,
    onMovieClick: PropTypes.func.isRequired,
    image: PropTypes.string.isRequired, // Add image propType
};
