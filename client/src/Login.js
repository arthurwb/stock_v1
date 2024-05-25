import React, { Component } from 'react';
import { Navigate  } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loggedIn: false
    };
  }

  handleLogin = () => {
    const { username, password } = this.state;
    document.cookie = `username=${username}`;
    // Perform login authentication here (e.g., call an API)
    // For simplicity, let's just check if username and password are not empty
    if (username !== '' && password !== '') {
      this.setState({ loggedIn: true });
      alert('Logged in successfully!');
    } else {
      alert('Please enter username and password.');
    }
  };

  handleLogout = () => {
    document.cookie = `username=`;
    this.setState({
      loggedIn: false,
      username: '',
      password: ''
    });
  };

  render() {
    const { username, password, loggedIn } = this.state;

    if (loggedIn) {
      return <Navigate to="/" replace />;
    }

    return (
      <div>
        <h1>Login</h1>
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
        <button onClick={this.handleLogin}>Login</button>
      </div>
    );
  }
}

export default Login;