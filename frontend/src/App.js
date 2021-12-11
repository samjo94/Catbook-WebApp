import React, { Fragment, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { AsyncTypeahead } from 'react-bootstrap-typeahead'; // ES2015
import axios from "axios"
import Routes from "./routes";
import { useHistory, Link } from "react-router-dom";
import {Row, Col, Button, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";



export default function App() {
  const [login, setLogin] = useState(checkLogin());
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const history = useHistory();


  function searchUsers(query){
    setIsLoading(true);
    axios({
      method: "get",
      withCredentials: true,
      url: "/search_user",
      params: {
        search_string: query
      }
    }).then((resp) => {
      const options = resp.data.map((i) => ({
        username: i.username
      }))
      setOptions(options);
      setIsLoading(false);
    });
  }

function changeUrl(url){
    history.push("/profile/" + url.target.value);
    history.go();
  }

  async function checkLogin() {
    await axios({
      method: "get",
      withCredentials: true,
      url: "/user",
    }).then((res) => {
      if(res.data){
        setUser(res.data.username);
        setLogin(true)
        return true;
      }
      else {

        setLogin(false)
        return false;
      }
    });
  };

  function logOut() {
    axios({
      method: "post",
      withCredentials: true,
      url: "/logout"
    }).then((res) => {
      setLogin(false);
      setUser("");
      history.push("/login");
      history.go();
    })
  }

  const filterBy = () => true;
  return (
    <div className="App container">
    <Row>
    <Col xs={6}>

      <Navbar fluid="true" collapseOnSelect>
          <Navbar.Brand>
            <Link to="/">Home</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        <Navbar.Collapse>
        { login
        ? <Nav className="m1-auto">
        <Navbar.Brand>Welcome {user}!</Navbar.Brand>
        <Button id="myprofile_button" href={"/profile/" + user}>My profile</Button>
        <Nav.Link id="logout_button" onClick={logOut}>Log out</Nav.Link>
        </Nav>
        :  <Nav className="m1-auto">
            <LinkContainer to={"/login"}>
            <Button id="loginbutton">Login</Button>
            </LinkContainer>
            <Nav.Item>
            <Nav.Link href="/signup" id="signup" >Sign up</Nav.Link>
            </Nav.Item>
          </Nav>
          }
        </Navbar.Collapse>
        </Navbar>
        </Col>

        <Col xs={2}></Col>
        <Col xs={4}>
        <AsyncTypeahead
      id="searchResults"
      isLoading={isLoading}
      filterBy = {filterBy}
      labelKey= 'username'
      minLength={3}
      onSearch={searchUsers}
      options={options}
      placeholder="Search for cats..."
      renderMenuItemChildren={(option, props) => (
        <Fragment>
        <Button id={option.username}value={option.username} onClick={changeUrl}>{option.username}</Button>
          </Fragment>
        )}

    />
      </Col>
      </Row>
      <Routes />
    </div>
  );
}
