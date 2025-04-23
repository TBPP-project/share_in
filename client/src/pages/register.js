import React, { useState } from "react";
import "../style/register.css"; // Register page CSS
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://3.12.1.104:4000/api/auth/signup", {
        name: fullname,
        email,
        password,
      });

      if (response.status === 201 || response.status === 200) {
        var token = response.data['token'];

        localStorage.setItem("token", token);
        console.log(token);
        alert("Registration successful! Please login.");
        navigate("/"); // Redirect to login page
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
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
        <div className="register-box">
          <h2 className="welcome-heading">Create an Account</h2>
          <div className="register-details">
            <form onSubmit={handleRegister}>
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                className="fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
              <br />
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
                <button type="submit" className="register-btn">Register</button>
              </div>
            </form>
            <div className="navigate-footer" onClick={() => navigate('/')}>
              Already have an account? <a href="/">Login</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
