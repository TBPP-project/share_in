import React from 'react';
import '../style/Homepage.css';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className='homepage-container'>
        <div className='container'>
          <div className='nav-bar'>
            <div className='image-logo'></div>
            <div className='sign-up'>
              <button onClick={() => navigate('/login')}>Sign up</button>
            </div>
          </div>

          <form>
            <div className="drop-zone">
              <div className="icon-container">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4BfAta7DiYLHuI5xgnfRvEEs8Q-kbGoPLdg&s" 
                  draggable="false" 
                  className="left" 
                  alt="File Icon" 
                />
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4BfAta7DiYLHuI5xgnfRvEEs8Q-kbGoPLdg&s" 
                  draggable="false" 
                  className="center" 
                  alt="File Icon" 
                />
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4BfAta7DiYLHuI5xgnfRvEEs8Q-kbGoPLdg&s" 
                  draggable="false" 
                  className="right" 
                  alt="File Icon" 
                />
              </div>
              <input type="file" id="fileInput" />
              <div className="title">
                Drop your files here or, <span id="browseBtn">browse</span>
              </div>
            </div>
          </form>

          <div className="progress-container">
            <div className="bg-progress"></div>
            <div className="inner-container">
              <div className="status">Uploading...</div>
              <div className="percent-container">
                <span className="percentage" id="progressPercent">0</span>%
              </div>
              <div className="progress-bar"></div>
            </div>
          </div>

          <div className="sharing-container">
            <p className="expire">Link expires in 24 hrs</p>
            <div className="input-container">
              <input type="text" id="fileURL" readOnly />
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAYmD7fVpets1HmTbk1UOvVt4CXxYCIfKVTQ&s" 
                id="copyURLBtn" 
                alt="Copy to clipboard icon" 
              />
            </div>
            <div className="direct-email">
              <span className='via-mail'> Share via mail</span>
            </div>
            <div className="email-container">
              <form id="emailForm">
                <div className="field">
                  <label htmlFor="fromEmail">Your email:</label>
                  <input type="email" autoComplete="email" required name="from-email" id="fromEmail" />
                </div>
                <div className="field">
                  <label htmlFor="toEmail">Receiver's email:</label>
                  <input type="email" required autoComplete="email" name="to-email" id="toEmail" />
                </div>
                <div className="send-btn-container">
                  <button type="submit">Send</button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default HomePage;
