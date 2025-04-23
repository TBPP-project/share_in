import React, { useState, useEffect } from "react";
import "../style/register.css";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Password strength checker
  useEffect(() => {
    if (!password) {
      setPasswordStrength("");
      return;
    }
    
    // Simple password strength logic
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    
    const strength = [hasLowerCase, hasUpperCase, hasNumber, hasSpecialChar, isLongEnough].filter(Boolean).length;
    
    if (strength <= 2) {
      setPasswordStrength("weak");
    } else if (strength <= 4) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("strong");
    }
  }, [password]);

  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!fullname || !email || !password) {
      displayToast("Please fill in all fields");
      return;
    }
    
    if (passwordStrength === "weak") {
      displayToast("Please choose a stronger password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://3.12.1.104:4000/api/auth/signup", {
        name: fullname,
        email,
        password,
      });

      if (response.status === 201 || response.status === 200) {
        const token = response.data['token'];
        localStorage.setItem("token", token);
        displayToast("Registration successful!");
        
        // Short delay to show success message before redirecting
        setTimeout(() => {
          navigate("/homepage");
        }, 1500);
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
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
                disabled={isLoading}
              />
              <br />
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
              
              {passwordStrength && (
                <div className={`password-strength ${passwordStrength}`}>
                  <div className="strength-bar">
                    <div></div>
                  </div>
                  <span className="strength-text">
                    {passwordStrength === "weak" && "Weak - Try a longer password with numbers and symbols"}
                    {passwordStrength === "medium" && "Medium - Good, but could be stronger"}
                    {passwordStrength === "strong" && "Strong - Excellent password!"}
                  </span>
                </div>
              )}
              
              <div className="button">
                <button 
                  type="submit" 
                  className={`register-btn ${isLoading ? "loading" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Register"}
                </button>
              </div>
            </form>
            <div className="navigate-footer">
              Already have an account? <a href="/">Login</a>
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

export default Register;