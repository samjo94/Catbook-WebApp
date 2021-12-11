import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios"
import { useHistory} from "react-router-dom";


export default function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  function validateForm() {
    return email.length > 0 && password.length > 0 && username.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await axios({
        method: 'post',
        url: '/save',
        headers: {},
        params: {
          username: username,
          password: password,
          email: email
        }
      }).then((result) => {
          history.push("/login");
          history.go();
    });
  }
     catch (e) {
      console.log("Invalid input");
    }
  }

  return (
    <div className="signup">
    <form onSubmit={handleSubmit}>
    <Form>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
        id="email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Enter email" />
      </Form.Group>

      <Form.Group controlId="formUserName">
        <Form.Label>Username</Form.Label>
        <Form.Control
        id="username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Enter Username" />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
        id="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        type="password"
        placeholder="Password" />
      </Form.Group>
      <Button variant="primary" type="submit" id="signupbutton">
        Submit
      </Button>
    </Form>
    </form>
    </div>
  );
}
