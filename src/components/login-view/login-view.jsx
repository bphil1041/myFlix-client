import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

export const LoginView = ({ onLoggedIn }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            access: username,
            secret: password,
        };

        fetch("https://myflixbp-ee7590ef397f.herokuapp.com", {
            method: "POST",
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    onLoggedIn(username);
                } else {
                    alert("Login failed");
                }
            })
            .catch((error) => {
                console.error("Error during login:", error);
                alert("An error occurred during login");
            });
    };

    return (
        <Form onSubmit={handleSubmit} className="login-form" style={{ marginTop: "80px" }}>
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
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
};
