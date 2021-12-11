const superagent = require('superagent');
const supertest = require('supertest');
var expect = require('expect.js');
const bodyParser = require('body-parser');
const functions = require('../middleware.js');
const app = require('../app.js');
const agent = supertest.agent(app);
var SALT_WORK_FACTOR = 10;
const schema = ("../userschema.js");
const axios = require("axios");



// Saving a user and seeing if it is saved in database. Correct input of data.
describe('Save user', function() {
  it('Sign up', async function() {
    await axios({
      method: 'post',
      url: 'http://localhost:5000/save',
      headers: {},
      params: {
        username: "bengt",
        password: "pass123",
        email: "hej@hotmail.com"
      }}).then((result) => {
          expect(result.status).to.equal(200);
      }).catch(error => {
        console.log(error);
      });
    });
  it('Get signed up user', function(done){
    axios({
      method: 'get',
      url: 'http://localhost:5000/getprofile',
      headers: {},
      params: {
        username: "bengt"
      }}).then((result) => {
        expect(result.data.username).to.equal("bengt");
        done();
      }).catch(done);
    });
  it('Sign up with existing user', function(done) {
    axios({
      method: 'post',
      url: 'http://localhost:5000/save',
      headers: {},
      params: {
        username: "bengt",
        password: "pass123",
        email: "hej@hotmail.com"
      }}).then((result) => {
      }).catch(error => {
        expect(error.response.status).to.equal(405);
      });
      done();
    });
    it('Sign up with non existent parameters', function(done){
      axios({
        method: 'post',
        url: 'http://localhost:5000/save',
        headers: {},
        params: {
          wrongusername: "",
          wrongpassword: "",
          wrongemail: ""
        }}).then((result) => {
        }).catch(error =>{
          expect(error.response.status).to.equal(500);
        });
        done();
      });
      it('Sign up with too few parameters', function(done){
        axios({
          method: 'post',
          url: 'http://localhost:5000/save',
          headers: {},
          params: {
            username: "user2",
            password: "passw"
          }}).then((result) => {
          }).catch(error => {
            expect(error.response.status).to.equal(500);
          });
          done();
        });
      it('Sign up with wrong method user', function(done) {
        axios({
          method: 'get',
          url: 'http://localhost:5000/save',
          headers: {},
          params: {
            username: "bengt",
            password: "pass123",
            email: "hej@hotmail.com"
          }}).then((result) => {
            done();
          }).catch(error => {
            expect(error.response.status).to.equal(404);
          });
          done();
        });

        it('Sign up with ineligible parameters', function(done) {
          axios({
            method: 'post',
            url: 'http://localhost:5000/save',
            headers: {},
            params: {
              username:"bingbong",
              password: { $gt: "" },
              email: "bigbruh@hot.com"
            }}).then((result) => {
            }).catch(error => {
              expect(error.response.status).to.equal(500);
            });
            done();
          });

});
describe('Get user', function() {
  it('Get bengt', function(done){
    axios({
      method: 'get',
      url: 'http://localhost:5000/getprofile',
      headers: {},
      params: {
        username: "bengt",
    }}).then((result) => {
      expect(result.data.username).to.equal("bengt");
      expect(result.status).to.equal(200);
      done();
    }).catch(done);
  });

  it('Get user with wrong parameters', function(done){
    axios({
      method: 'get',
      url: 'http://localhost:5000/getprofile',
      headers: {},
      params: {
        password: "bengt",
    }}).then((result) => {
    }).catch(err => {
      expect(err.response.status).to.equal(500);
    });
    done();

  });

  it('Get bengt with incorrect username', function(done){
    axios({
      method: 'get',
      url: 'http://localhost:5000/getprofile',
      headers: {},
      params: {
        username: { $ne: 1 },
    }}).then((result) => {
    }).catch(err => {
      expect(err.response.status).to.equal(500);
    });
    done();
  });

});


describe('Friendrequests', function() {
  it('Create second user', function(done){
    axios({
      method: 'post',
      url: 'http://localhost:5000/save',
      headers: {},
      params: {
        username: "user2",
        password: "passw",
        email: "user2@adress.com"
    }}).then((result) => {
      expect(result.status).to.equal(200);
      done();
    }).catch(done);
  });
  it('Send request', function(done){
    axios({
      method: 'post',
      url: 'http://localhost:5000/friendrequest',
      headers: {},
      params: {
        toUser: "bengt",
        sessionUser: "user2"
    }}).then((result) => {
      expect(result.status).to.equal(200);
      done();
    }).catch(done);
  });

  it('Check pending', function(done){
    axios({
      method: 'get',
      url: 'http://localhost:5000/getprofile',
      headers: {},
      params: {
        username: "user2"
    }}).then(result => {
      expect(result.status).to.equal(200);
      expect(result.data.pending[0]).to.equal('bengt');
      done();
    }).catch(done);
  });
  it('Check request', function(done){
    axios({
      method: 'get',
      url: 'http://localhost:5000/getprofile',
      headers: {},
      params: {
        username: "bengt"
    }}).then(result => {
      expect(result.status).to.equal(200);
      expect(result.data.requests[0]).to.equal('user2');
      done();
    }).catch(done);
  });

  it('Deny request', function(done){
    axios({
      method: 'post',
      url: 'http://localhost:5000/denyrequest',
      headers: {},
      params: {
        to_user: "bengt",
        from_user: "user2"
    }}).then(result => {
      expect(result.status).to.equal(200);
      done();
    }).catch(done);
  });

  it('Check pending', function(done){
    axios({
      method: 'get',
      url: 'http://localhost:5000/getprofile',
      headers: {},
      params: {
        username: "user2"
    }}).then(result => {
      expect(result.status).to.equal(200);
      expect(result.data.pending.length).to.equal(0);
      done();
    }).catch(done);
  });
  it('Check request', function(done){
    axios({
      method: 'get',
      url: 'http://localhost:5000/getprofile',
      headers: {},
      params: {
        username: "bengt"
    }}).then(result => {
      expect(result.status).to.equal(200);
      expect(result.data.requests.length).to.equal(0);
      done();
    }).catch(done);
  });

  it('Re-send request', function(done){
    axios({
      method: 'post',
      url: 'http://localhost:5000/friendrequest',
      headers: {},
      params: {
        toUser: "bengt",
        sessionUser: "user2"
    }}).then((result) => {
      expect(result.status).to.equal(200);
      done();
    }).catch(done);
  });

  it('Accept request', function(done){
    axios({
      method: 'post',
      url: 'http://localhost:5000/acceptrequest',
      headers: {},
      params: {
        to_user: "bengt",
        from_user: "user2"
    }}).then(result => {
      expect(result.status).to.equal(200);
      done();
    }).catch(done);
  });
  it('Check friendlist', function(done){
    axios({
      method: 'get',
      url: 'http://localhost:5000/getprofile',
      headers: {},
      params: {
        username: "user2"
    }}).then(result => {
      expect(result.status).to.equal(200);
      expect(result.data.friendlist[0]).to.equal("bengt");
      done();
    }).catch(done);
  });
});

describe('test login', function() {
  it('Login with Bengt', function(done){
    axios({
      method: 'post',
      url: 'http://localhost:5000/login',
      headers: {},
      params: {
        email: "hej@hotmail.com",
        password: "pass123"
    }}).then((result) => {
      expect(result.data.user).to.equal("bengt");
      expect(result.data.auth).to.equal(true);
      done();
    }).catch(done);
  });

  it('Login with non existing user', function(done){
    axios({
      method: 'post',
      url: 'http://localhost:5000/login',
      headers: {},
      params: {
        email: "idontexist@usch.ble",
        password: "uschblegh"
    }}).then((result) => {
      expect(result.data.auth).to.equal(false);
      done();
    }).catch(done);
  });

  it('Login with invalid input', function(done){
    axios({
      method: 'post',
      url: 'http://localhost:5000/login',
      headers: {},
      params: {
        email: {$ne:1},
        password: {$ne:1}
    }}).then((result) => {
      expect(result.data.auth).to.equal(false);
      done();
    }).catch(done);
  });

it('Login with non existing parameters', function(done){
  axios({
    method: 'post',
    url: 'http://localhost:5000/login',
    headers: {},
    params: {
      wrongemail: "idontexist@usch.ble",
      wrongpassword: "uschblegh"
  }}).then((result) => {
  }).catch((error) => {
    expect(error.data.auth).to.equal(false);
  });
  done();
});
});


describe('Publish message', function() {
  it('Publish message', function(done){
    axios({
      method: 'post',
      url: 'http://localhost:5000/publishmessage',
      headers: {},
      params: {
        username: "bengt",
        from_user: "user2",
        message: "Message for bengt",
        date: Date.now()
    }}).then(result => {
      expect(result.status).to.equal(200);
      done();
    }).catch(done);
  });

  it('Check messages', function(done){
    axios({
      method: 'get',
      url: 'http://localhost:5000/getprofile',
      headers: {},
      params: {
        username: "bengt"
    }}).then(result => {
      expect(result.status).to.equal(200);
      expect(result.data.messages[0].message[0]).to.equal("Message for bengt");
      expect(result.data.messages[0].from_user[0]).to.equal("user2");
      done();
    }).catch(done);
  });

  it('Publish message with incorrect parameters', function(done){
    axios({
      method: 'post',
      url: 'http://localhost:5000/publishmessage',
      headers: {},
      params: {
        nonexistent: "bengt",
        from_user: "user2",
        message: "Message for bengt",
        date: Date.now()
    }}).then(result => {
    }).catch(error => {
      expect(error.response.status).to.equal(500);
    });
    done();
  });

  it('Clear database', function(done){
    axios({
      method: 'get',
      url: 'http://localhost:5000/deleteall',
      headers: {}
    }).then((result) => {
    }).catch(error => {
    });
    done();
  });
});

describe('Search user', function() {
  it('Search for bengt', function(done){
    axios({
      method: 'get',
      url: 'http://localhost:5000/search_user',
      headers: {},
      params: {
        search_string: "ngt"
    }}).then(result => {
      expect(result.status).to.equal(200);
      done();
    }).catch(done);
  });
});
