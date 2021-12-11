import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./home";
import Login from "./login";
import ProfileData from "./profile"
import NotFound from "./notfound";
import SignUp from "./signup";
// import Home from "./containers/Home";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>

      <Route exact path="/login">
      <Login />
      </Route>

      <Route exact path="/signup">
      <SignUp />
      </Route>

      <Route exact path="/profile/:userName" component={ProfileData} />


      <Route>
      <NotFound />
      </Route>


    </Switch>
  );
}
