import React, {Component} from "react";
import {FormControl, InputGroup, Button, Row, Col, Nav} from "react-bootstrap";
import axios from "axios";
export default class ProfileData extends Component {
  constructor(match, location){
    super(match, location);
    this.state = {
      userName : match.match.params.userName,
      sessionUser : null,
      message : "",
      friendlist: [],
      pending : [],
      requests: [],
      data : [],
      isFriend : true,
    };
    this.onStart();
    this.setUp();

  };



  async setUp(){
    await this.getUser();
    await this.userIsFriend();
  }


  userIsFriend() {
    if(this.state.userName &&
      this.state.sessionUser &&
      this.state.data.friendlist){
    if(this.state.userName === this.state.sessionUser){
      this.setState({
          isFriend : true
      });
      return true;
    }
    else if(this.state.friendlist.includes(this.state.sessionUser)){
      this.setState({
          isFriend : true
      });
      return true;
    }
    else if(this.state.requests.includes(this.state.sessionUser)){
      this.setState({
          isFriend : true
      });
      return true;
    }
    else if(this.state.pending.includes(this.state.sessionUser)){
      this.setState({
          isFriend : true
      });
      return true;
    }
    else{
      this.setState({
        isFriend: false
      });
      return false;
    }
  }};

  async sendRequest() {
    this.setState({
      isFriend: true
    });
    await axios({
      method: "post",
      withCredentials: true,
      url: "/friendrequest",
      params: {
        sessionUser: this.state.sessionUser,
        toUser: this.state.userName
      }
    })
  };

  async acceptRequest(event) {

    let from_user = event.target.value;
    let to_user = this.state.sessionUser;
    await axios({
      method: "post",
      withCredentials: true,
      url: "/acceptrequest",
      params: {
        to_user: to_user,
        from_user: from_user
      }
    })
    var array = this.state.requests;
    var index = array.indexOf(from_user)
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({requests: array});
    }
    var array = this.state.friendlist;
    if (index !== -1) {
      array.push(from_user);
      this.setState({friendlist: array});
    }

  };

  async denyRequest(event) {
    let from_user = event.target.value;
    let to_user = this.state.sessionUser;
    await axios({
      method: "post",
      withCredentials: true,
      url: "/denyrequest",
      params: {
        to_user: to_user,
        from_user: from_user
      }
    })
    var array = this.state.requests;
    var index = array.indexOf(from_user)
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({requests: array});
    }
  };


  async getUser() {
    await axios({
      method: "get",
      withCredentials: true,
      url: "/user",
    }).then((res) => {
      this.state.sessionUser = (res.data.username);
    });
    await axios({
      method: "get",
      withCredentials: true,
      url: "/getprofile",
      params:{
        username: this.state.userName
      }
    }).then((res) => {
      this.state.pending = res.data.pending;
      this.state.friendlist = res.data.friendlist;

    });
  };

  async onStart(){
    const data = await axios({
      method: 'get',
      url: '/getprofile',
      params: {
        username: this.state.userName,
      }
    }).then(
      (result) => {
        const res_user = result.data;
        if(!(res_user)){
          this.setState({
            profile_found: false,
          });
        }
        else{
          this.setState({
            profile_found: true,
            requests: result.data.requests,
            friendlist: result.data.friendlist,
            data: result.data,
          });
        }
      },
      (error) => {
        this.setState({
          profile_found: false,
          error
        });
      }

    )
  }

displayMessages(messages){
  return(
  <ul className="list-group">
  Messages:
  {messages.map(message => (
    <li className="list-group-item list-group-item-primary">
      <Row>
      <Col><Nav.Link href={"/profile/" + message.from_user}>{message.from_user}</Nav.Link> <p>Date:  {message.date.substr(0,10) }</p></Col>
      <Col><div  class="message">{message.message} </div></Col>
      <Col> </Col>
      </Row>
    </li>
  ))}
  </ul>)
}

displayFriends(friendlist){
  if(friendlist){
  return(
    <ul className="list-group">
        Friends:
        {friendlist.map(friend => (
          <li className="list-group-item list-group-item-primary">
            <Nav.Link href={"/profile/" + friend} >{friend}</Nav.Link>
          </li>
        ))}
      </ul>)}
      else{
        return null;
      }


}
async publish_message(event){
  if(this.state.sessionUser){
  const data = await axios({
    method: 'post',
    url: '/publishmessage',
    params: {
      message: this.state.message,
      username: this.state.userName,
      from_user: this.state.sessionUser,
      date: Date.now()
    }
  }).then(
    (result) => {
      console.log(result.data);
      const res_user = result.data;
      if(!(res_user)){
        this.setState({
          profile_found: true,
        });
      }
      else{
        this.setState({
          profile_found: true,
          data: result.data,
        });
      }
    },
    (error) => {
      this.setState({
        profile_found: false,
        error
      });
    }

  )}
}

  handleMessage(e){
    console.log(e.target.value);
    this.setState({
      message: e.target.value
    })
  }

  render(){
  if(this.state.profile_found === true){
  return(
    <div className="Profile">
    <Row>
      <Col xs={8}><h1 id="userheader" style={{ float: 'left' }}>{this.state.data.username} {this.state.isFriend
      ? null
      :<Button id="addfriend" onClick={this.sendRequest.bind(this)}>Add Friend</Button>}</h1>

          <form onSubmit={this.publish_message.bind(this)}>
          <InputGroup>
          <FormControl
          id="message_field"
          placeholder="Write something"
          aria-label="..."
          aria-describedby="basic-addon2"
          onChange={this.handleMessage.bind(this)}
          />
          <InputGroup.Append>
          <Button variant="outline-secondary" id="submit_message_button" type="submit">Submit</Button>
          </InputGroup.Append>
          </InputGroup>
          </form>
          {this.displayMessages(this.state.data.messages)}

      </Col>


      <Col xs={4}>
        {this.displayFriends(this.state.friendlist)}

        {this.state.sessionUser === this.state.userName
          ?<ul className="list-group">

        Incoming Friend requests:
            {this.state.requests.map(requests => (
              <li className="list-group-item list-group-item-primary">
                <Nav.Link href={"/profile/" + requests} >{requests}</Nav.Link>
                <Button id="acceptbutton" variant="success" value={requests} onClick={this.acceptRequest.bind(this)}>✓</Button>
                <Button id="denybutton" variant="danger" value={requests} onClick={this.denyRequest.bind(this)}>x</Button>
              </li>
            ))}
          </ul>
          :null}
    </Col>
        <Col sm={8}>

        </Col>
        </Row>
    </div>
  )}
  else if(this.state.profile_found === false){
    return(
      <div>
        <h1>User does not exist</h1>
      </div>
    )
  } else {
    return(
      <div>
        <h1>Loading...</h1>
      </div>
    )
  }
}
};
