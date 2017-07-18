import React, { Component } from 'react';
import * as firebase from 'firebase';

var config = {
    apiKey: "AIzaSyCxNCAT3B1li154STUSjagsWHBDIMDuHQs",
    authDomain: "react-nodejs.firebaseapp.com",
    databaseURL: "https://react-nodejs.firebaseio.com",
    projectId: "react-nodejs",
    storageBucket: "",
    messagingSenderId: "602357980178"
  };
firebase.initializeApp(config);

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      hasAccount: true,
      userEmail: "",
      userPassword: ""
    };
    this.toggleAuthState = this.toggleAuthState.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.confirmPassword = this.confirmPassword.bind(this);
    this.updateAuthStatus = this.updateAuthStatus.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentWillMount() {
    this.updateAuthStatus();
  }
  
  render() {
    return (
      <div className="App">
        {this.renderAuthForm()}
      </div>
    );
  }

  updateAuthStatus() {
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser)
        return this.setState({
          isLoggedIn: true
        });
      return this.setState({
        isLoggedIn: false
      });
    });
  }

  handleSubmit(event) {
    if (this.state.hasAccount === true){
      const promise = firebase.auth().signInWithEmailAndPassword(this.state.userEmail, this.state.userPassword);
      promise.catch(e => alert(e.message));
      this.updateAuthStatus();
      return;
    }
    const confirmValue = document.getElementsByName("confirm-password")[0].value;
    if (confirmValue !== this.state.userPassword) {
      alert("Wrong password confirmation!");
      return;
    }
    const promise = firebase.auth().createUserWithEmailAndPassword(this.state.userEmail, this.state.userPassword);
    promise.catch(e => alert(e.message));
    this.updateAuthStatus();
    return;
  }

  logInFacebook() {
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      this.updateAuthStatus();
    }).catch(function(e) {
      alert(e.message);
    });
  }

  logInTwitter() {
    var provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
      // You can use these server side with your app's credentials to access the Twitter API.
      var token = result.credential.accessToken;
      var secret = result.credential.secret;
      this.updateAuthStatus();
    }).catch(function(e) {
      alert(e.message);
    });
  }

  renderAuthForm() {
    if (this.state.isLoggedIn === false){
      return (
        <div id="login">
          <div className="form-signin">
            {this.renderRightForm()}
            <div className="text-center social-btn-container">
              <button className="loginBtn loginBtn--facebook" onClick={this.logInFacebook}>
                Login with Facebook
              </button>
              <button className="loginBtn loginBtn--twitter" onClick={this.logInTwitter}>
                Login with Twitter
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.renderLogOutButton();
  }

  renderRightForm() {
    if (this.state.hasAccount === true)
      return this.renderLogInForm();
    return this.renderSignUpForm()
  }

  toggleAuthState() {
    if (this.state.hasAccount === true)
      return this.setState({
        hasAccount: false
      });
    return this.setState({
        hasAccount: true
      });
  }

  renderLogInForm() {
    return (
      <div>
        <h2 className="form-signin-heading">Please Login</h2>
        <input value={this.state.userEmail} onChange={this.handleChangeEmail} name="email" type="text" className="form-control" placeholder="Email Address" required autoFocus/>
        <input value={this.state.userPassword} onChange={this.handleChangePassword} name="password" type="password" className="form-control" placeholder="Password" required/>
        <button onClick={this.handleSubmit} className="btn btn-lg btn-primary btn-flat">Log In</button>
        <button onClick={this.toggleAuthState} className="btn btn-lg btn-default btn-flat pull-right">Registration</button>
      </div>
    );
  }

  renderSignUpForm() {
    return (
      <div>
        <h2 className="form-signin-heading">Sign Up</h2>
        <input value={this.state.userEmail} onChange={this.handleChangeEmail} name="email" type="text" className="form-control" placeholder="Email Address" required autoFocus/>
        <input value={this.state.userPassword} onChange={this.handleChangePassword} name="password" type="password" className="form-control" placeholder="Password" required/>
        <input onBlur={this.confirmPassword} name="confirm-password" type="password" className="form-control" placeholder="Confirm Password" required/> 
        <button onClick={this.handleSubmit} className="btn btn-lg btn-primary btn-flat">Sign Up</button>
        <button onClick={this.toggleAuthState} className="btn btn-lg btn-default btn-flat pull-right">Cancel</button>
      </div>
    );
  }

  renderLogOutButton() {
    return (
      <button id="logout" onClick={this.logOut} className="btn btn-lg btn-default btn-flat">Log Out</button>
    );
  }

  handleChangeEmail(e) {
    return this.setState({
      userEmail: e.target.value
    });
  }

  handleChangePassword(e) {
    return this.setState({
      userPassword: e.target.value
    });
  }

  confirmPassword(e) {
    if (e.target.value !== this.state.userPassword)
      alert("Wrong password confirmation!");
  }

  logOut(e) {
    return firebase.auth().signOut();
  }
}

export default App;
