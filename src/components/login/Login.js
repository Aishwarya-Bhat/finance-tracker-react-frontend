import React, { useState } from "react";
import "./Login.css"; // Add custom styling here
import logo from "../../assets/logo1.png"; // Adjust the path based on your folder structure
import { useNavigate } from 'react-router-dom';

function Login() {
  // State for username, password, and feedback message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  
  // Mock user data for authentication
  const mockUser = {
    username: "anamika",
    password: "pw",
  };

  // Handle login submission
  const handleLogin = (e) => {
    e.preventDefault();

    // Check if entered credentials match the mock data
    if (username === mockUser.username && password === mockUser.password) {
      setMessage("Login successful!");
      navigate('/dashboard'); // Redirect to the dashboard page
     // navigate('/budget-list');

    } else {
      setMessage("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      {/* <div style={{ display: 'flex', flex-direction: 'column'}}>
       <img src={logo} alt="App Logo" className="app-logo" />
       <label>Personal Finance Tracker</label>
      </div> */}
      {/* <div style={{ justifyContent: 'center' }}>
        <img src={logo} alt="App Logo" className="app-logo" />
        <label>Personal Finance Tracker!</label>
      </div> */}
        <img src={logo} alt="App Logo" className="app-logo" />
      <h2>Personal Finance Tracker</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Login;
