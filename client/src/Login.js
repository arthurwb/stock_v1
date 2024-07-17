import React, { Component } from "react";
import { Navigate } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      loggedIn: false,
      createUserMode: false, // Track whether in create user mode
    };
  }

  handleLogin = () => {
    const { username, password } = this.state;

    // Send a POST request to your server-side login endpoint
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // If login is successful, update state to reflect logged in status
          this.setState({ loggedIn: true });
          document.cookie = `username=${username}`;
          alert("Logged in successfully!");
        } else {
          // If login fails, display an error message
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while logging in.");
      });
  };

  handleCreateUser = () => {
    const { username, password } = this.state;
    const carrots = {carrots: 0};
    const wallet = 0;

    // Send a POST request to your server-side createUser endpoint
    fetch("/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, carrots, wallet }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          return data;
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while creating user.");
      });
  };

  handleToggleMode = () => {
    // Toggle between login mode and create user mode
    this.setState((prevState) => ({
      createUserMode: !prevState.createUserMode,
    }));
  };

  handleLogout = () => {
    document.cookie = `username=`;
    this.setState({
      loggedIn: false,
      username: "",
      password: "",
    });
  };

  render() {
    const { username, password, loggedIn, createUserMode } = this.state;

    if (loggedIn) {
      return <Navigate to="/" replace />;
    }

    return (
      <div>
        <h1>{createUserMode ? "Create User" : "Login"}</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => this.setState({ username: e.target.value })}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => this.setState({ password: e.target.value })}
        />
        <br />
        {createUserMode ? (
          <button onClick={this.handleCreateUser}>Create User</button>
        ) : (
          <button onClick={this.handleLogin}>Login</button>
        )}
        <br />
        <button onClick={this.handleToggleMode}>
          {createUserMode ? "Switch to Login" : "Switch to Create User"}
        </button>
      </div>
    );
  }
}

export default Login;
