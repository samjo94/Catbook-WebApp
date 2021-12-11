import React, {Component} from "react";
import "./notfound.css";
import axios from "axios"

export default class NotFound extends Component  {
  constructor() {
    super();
    axios.get("/*");
  }
  render() {
  return (
    <div className="NotFound">
      <h3>Sorry, page not found!</h3>
    </div>
  )
}
};
