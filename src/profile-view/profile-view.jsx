// Import statements
import { useState } from "react";
import { Col, Row, Container, Button, Card, Form } from "react-bootstrap";
import { MovieCard } from "../components/movie-card/movie-card";

// ProfileView component
export const ProfileView = ({ user, movies, setUser, removeFav, addFav }) => {
    // State variables
    const [username, setUsername] = useState(user.username);
    const [password, setPassword] = useState(user.password);
    const [email, setEmail] = useState(user.email);
    const [birthday, setBirthday] = useState(user.birthday);

    // Navigation
    const navigate = useNavigate();

    // Return movies present in the user's favorite movies array
    const favoriteMovies = user.favoriteMovies ? movies.filter((movie) => user.favoriteMovies.includes(movie._id)) : [];

    // Update user information
    const handleUpdate = (event) => {
        event.preventDefault();

        // Gather updated user data
        const data = {
            username: username,
            password: password,
            email: email,
            birthday: birthday,
        }

        // Fetch request to update user data
        fetch(`https://movie-api-da5i.onrender.com/users/${user.name}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }).then(async (response) => {
            console.log(response)
            if (response.ok) {
                response.json();
                alert('updated!')
            } else {
                const e = await response.text()
                console.log(e)
                alert("Update failed.")
            }
        }).then((updatedUser) => {
            if (updatedUser) {
                localStorage.setItem('user', JSON.stringify(updatedUser))
                setUser(updatedUser)
            }
        })
    }

    // Delete user account
    const handleDelete = () => {
        fetch(`https://movie-api-da5i.onrender.com/users/${user.name}`, {
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
        })
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
                                token={token}
                                setUser={setUser}
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
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                        <Button className="update" type="submit" onClick={handleUpdate}>Update</Button>
                        <Button className="delete" onClick={handleDelete}>Delete Account</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
