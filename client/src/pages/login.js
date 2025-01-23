import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/Login.css"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log("Login form submitted");
  };

  return (
    <div className="container">
      <div className="left">
        <h1 className="logo">InShare</h1>
        <h2>Welcome to InShare Panel</h2>
      </div>
      <div className="right">
        <h2>Sign In</h2>
        <p>Please sign in to your admin account</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" placeholder="Enter your email" required />
          <label htmlFor="password">Password</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              required
            />
            <span onClick={togglePasswordVisibility} className="toggle-password">
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          <div className="remember-me">
            <input type="checkbox" id="rememberMe" />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          <button type="submit" className="sign-in-button">Sign In</button>
          <div className="register-link">
            <p>
              Do not have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
