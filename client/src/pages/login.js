import React, { useState } from "react";
import '../style/Login.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      displayToast("Please enter email and password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://3.12.1.104:4000/api/auth/signin", {
        email,
        password,
      });

      if (response.status === 200) {
        const token = response.data['token'];
        localStorage.setItem("token", token);
        displayToast("Login successful!");
        
        // Short delay to show success message before redirecting
        setTimeout(() => {
          navigate("/homepage");
        }, 1000);
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Invalid email or password. Please try again.";
      displayToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Container">
      <div className="left-container">
        <div className="left-heading-content">
          <h3 className="left-heading">Share Your Files Easily</h3>
          <h6 className="left-sub-heading">No Limits, No Hassle - Just Share with a Link!</h6>
        </div>
        <div className="left-footer">© 2025 Share In. All rights reserved.</div>
      </div>

      <div className="right-container">
        <div className="login-in-box">
          <h2 className="welcome-heading">Welcome Back!</h2>
          <div className="login-deatils">
            <form onSubmit={handleLogin}>
              <input
                type="email"
                name="email"
                placeholder="user@example.com"
                className="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
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
                disabled={isLoading}
              />
              <br />
              <div className="button">
                <button 
                  type="submit" 
                  className={`login-btn ${isLoading ? "loading" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
            <div className="right-footer">
              Don't have an account? <a href="/register">Register</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      <div className={`toast ${showToast ? "visible" : ""}`}>
        {toastMessage}
      </div>
    </div>
  );
};

export default Login;