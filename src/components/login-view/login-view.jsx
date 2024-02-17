import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./login-view.scss";

export const LoginView = ({ onLoggedIn }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            Username: username,
            Password: password,
        };

        fetch("https://myflixbp-ee7590ef397f.herokuapp.com/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Login response: ", data);
                if (data.user && data.token) {
                    onLoggedIn(data.user, data.token);
                    // Store the token in localStorage
                    localStorage.setItem("token", data.token);
                    console.log("Token stored in localStorage:", data.token);
                    // Store the user object in localStorage
                    localStorage.setItem("user", JSON.stringify(data.user));
                    console.log("User object stored in localStorage:", data.user);
                } else {
                    alert("Invalid credentials");
                }
            })
            .catch((e) => {
                alert("Something went wrong");
            });
    };


    return (
        <Form onSubmit={handleSubmit} className="login-form" style={{ marginTop: "80px" }}>
            <Form.Group controlId="formUsername">
                <Form.Label className="input-field">Username:</Form.Label>
                <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength="3"
                />
            </Form.Group>

            <Form.Group controlId="formPassword">
                <Form.Label className="input-field">Password:</Form.Label>
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
