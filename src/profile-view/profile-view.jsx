// Import statements
import { useState } from "react";
import { Col, Row, Container, Button, Card, Form } from "react-bootstrap";
import { MovieCard } from "../components/movie-card/movie-card";
import { useNavigate } from "react-router-dom";

// ProfileView component
export const ProfileView = ({ user, movies, setUser, removeFav, addFav }) => {
    // State variables
    const [username, setUsername] = useState(user.username);
    const [password, setPassword] = useState(user.password);
    const [email, setEmail] = useState(user.email);
    const [birthday, setBirthday] = useState(user.birthday);
    const [isLoading, setIsLoading] = useState(false);

    // Navigation
    const navigate = useNavigate();

    // Return movies present in the user's favorite movies array
    const favoriteMovies = user.favoriteMovies ? movies.filter((movie) => user.favoriteMovies.includes(movie._id)) : [];

    // Update user information
    const handleUpdate = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            // Gather updated user data
            const data = {
                username: username,
                password: password,
                email: email,
                birthday: birthday,
            }

            // Fetch request to update user data
            const response = await fetch(`https://myflixbp-ee7590ef397f.herokuapp.com/users/${user.name}`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                const updatedUserData = await response.json();
                localStorage.setItem('user', JSON.stringify(updatedUserData));
                setUser(updatedUserData);
                alert('Updated!');
            } else {
                const error = await response.text();
                console.error('Update failed:', error);
                alert('Update failed. Please try again.');
            }
        } catch (error) {
            console.error('Update failed:', error);
            alert('Update failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    // Delete user account
    const handleDelete = () => {
        setIsLoading(true);

        fetch(`https://myflixbp-ee7590ef397f.herokuapp.com/users/${user.name}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.ok) {
                setUser(null);
                alert("Your account has been deleted");
            } else {
                alert("Something went wrong.")
            }
        }).finally(() => {
            setIsLoading(false);
        });
    }

    // JSX rendering of the component
    return (
        <Container>
            <Row className="justify-content-md-center mx-3 my-4">
                <h2 className="profile-title">Favorite Movies</h2>
                {/* Render favorite movies */}
                {favoriteMovies.map((movie) => {
                    return (
                        <Col
                            key={movie._id}
                            className="m-3"
                        >
                            <MovieCard
                                movie={movie}
                                user={user}
                            />
                        </Col>
                    );
                })}
            </Row>

            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="profile-title">Update info</h2>
                    {/* User information update form */}
                    <Form className="my-profile" onSubmit={handleUpdate}>
                        {/* Form fields for name, password, email, and birthday */}
                        <Form.Group className="mb-2" controlId="formName">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group >
                        <Form.Group className="mb-2" controlId="formPassword">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="formEmail">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formBirthday">
                            <Form.Label>Birthday:</Form.Label>
                            <Form.Control
                                type="date"
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                                required
                            />
                        </Form.Group>

                        {/* Update and delete buttons */}
                        <Button className="btn btn-primary update" type="submit" onClick={handleUpdate} disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update'}
                        </Button>
                        <Button className="btn btn-danger delete" onClick={handleDelete} disabled={isLoading}>
                            {isLoading ? 'Deleting...' : 'Delete Account'}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}




