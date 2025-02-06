import React from "react";
import "../style/register.css"; // Using a  CSS file for register page
import { useNavigate } from 'react-router-dom';

const Register = () => {

  const navigate = useNavigate();
  return (
    <div>
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
            <h2 className="welcome-heading"> Create an Account</h2>
            <div className="register-details"> 
              <form>
                <input type="text" name="fullname" placeholder="Full Name" className="fullname" required />
                <br />
                <input type="email" name="email" placeholder="user@Example.com" className="email" required />
                <br />
                <br/>
                <input type="password" name="password" placeholder="Password" className="password" required />
                <br />
              </form>
              <div className="button"><button type="submit" className="register-btn">Register</button></div>
              <div className="navigate-footer"  onClick={() => navigate('/')}> have an account <a href="/">login</a></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
