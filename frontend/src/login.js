import React, { useState } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { useHistory} from "react-router-dom";
import axios from "axios"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState(null);
  const [login, setLogin] = useState(false);
  const history = useHistory();

  function validateForm() {
    console.log("validate ");
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    try {
      axios({
        method: 'post',
        url: '/login',
        headers: {},
        params: {
          password: password,
          email: email
        }
      }).then((result) => {
        if(result.data.user){
          setLogin(true);
          history.push("/");
        }
      })
    } catch (e) {
      alert(e.message);
    }
    console.log(email, password);
    console.log("handlesubmit");
  }
  function getUser() {
    axios({
      method: "get",
      withCredentials: true,
      url: "/user",
    }).then((res) => {
      setData(res.data);
    });
  };

  function logOut() {
    axios({
      method: "post",
      withCredentials: true,
      url: "/logout"
    }).then((res) => {
      setData(res.data);
      setLogin(false);
    })
  }


  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <FormLabel >Email</FormLabel>
          <FormControl
            id="login_email_field"
            autoFocus
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <FormLabel>Password</FormLabel>
          <FormControl
            id="login_password_field"
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <Button id="login_button_field" block bsSize="large" disabled={!validateForm()} type="submit">
          Login
        </Button>

      </form>
    </div>
  );
}
