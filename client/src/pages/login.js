import React, { useState } from "react";
import '../style/Login.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://3.12.1.104:4000/api/auth/signin", {
        email,
        password,
      });

      if (response.status === 200) {
        var token = response.data['token'];

        localStorage.setItem("token", token);
        console.log(token);
        alert("Login successful!");
        navigate("/homepage"); // Redirect to dashboard on success
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="Container">
      <div className="left-container">
        <div className="left-heading-content">
          <h3 className="left-heading">Share Your Files Easily</h3>
          <h6 className="left-sub-heading">No Limits, No Hassle - Just Share with a Link!</h6>
        </div>
        <div className="left-footer"></div>
      </div>

      <div className="right-container">
        <div className="login-in-box">
          <h2 className="welcome-heading">Welcome Back!</h2>
          <div className="login-deatils">
            <form onSubmit={handleLogin}>
              <input
                type="email"
                name="email"
                placeholder="user@Example.com"
                className="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <br />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <br />
              <div className="button">
                <button type="submit" className="login-btn">Login</button>
              </div>
            </form>
            <div className="right-footer">
              Don't have an account? <a href="/register">Register</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
