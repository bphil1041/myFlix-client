import { useState } from "react";
import { Button, Card, Form, Row, Col } from "react-bootstrap";
import { MovieCard } from "../movie-card/movie-card";
import { useSelector, useDispatch } from "react-redux";
import { setUser, clearUser } from "../../redux/reducers/user";

export const ProfileView = () => {
    const { user, token } = useSelector((state) => state.user);
    const movies = useSelector((state) => state.movies.list);
    const [username, setUsername] = useState(user.Username);
    const [password, setPassword] = useState(user.Password);
    const [email, setEmail] = useState(user.Email);
    const [birthday, setBirthday] = useState(user.Birthday);

    const dispatch = useDispatch();

    let favoriteMovies = movies.filter(m => user.FavoriteMovies.includes(m.id))

    const handleUpdate = (event) => {
        event.preventDefault();

        const data = {
            Username: username,
            Password: password,
            Email: email,
            Birthday: birthday
        };
        fetch(`https://myflixbp-ee7590ef397f.herokuapp.com/users/${user.Username}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }).then(async (response) => {
            if (response.ok) {
                const updatedUser = await response.json();
                localStorage.setItem('user', JSON.stringify(updatedUser));
                dispatch(setUser({ user: updatedUser, token: token }));
                alert("Account information updated!");
            } else {
                alert("Account information was not updated!");
            }
        }).catch(error => {
            console.error('Error: ', error);
        });
    };

    const handleDelete = (event) => {
        event.preventDefault();

        fetch(`https://myflixbp-ee7590ef397f.herokuapp.com/users/${user.Username}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.ok) {
                alert("Account deleted!");
                dispatch(clearUser());
                window.location.reload();
            }
        }).catch(error => {
            console.error('Error: ', error);
        });
    };

    return (
        <>
            <h1>Profile</h1>
            <hr />
            <Row>
                <Col className="mb-4" md={8}>
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>Profile</Card.Title>
                            <Card.Text>Username: {user.Username}</Card.Text>
                            <Card.Text>Email: {user.Email}</Card.Text>
                            <Card.Text>Birthday: {user.Birthday}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className="mb-4">
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>Edit Profile</Card.Title>
                            <Form onSubmit={handleUpdate}>
                                <Form.Group controlId="formUsername">
                                    <Form.Label>Username:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        minLength="3"
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPassword">
                                    <Form.Label>Password:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEmail">
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
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row md={8}>
                <Col>
                    <Card>
                        <h1>Favorite movies</h1>
                        <hr />
                        {favoriteMovies.length === 0 ? (
                            <Col>This list is empty!</Col>
                        ) : (
                            <Row>
                                {favoriteMovies.map((movie) => (
                                    <Col className="mb-4" key={movie.id} md={3}>
                                        <MovieCard movie={movie} />
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Card>
                </Col>
            </Row>
            <Button variant="primary" onClick={handleDelete}>
                Delete Account
            </Button>
        </>
    )
}
