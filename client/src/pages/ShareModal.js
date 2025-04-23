import React, { useState } from 'react';
import axios from 'axios';

const ShareModal = ({ file, onClose, onShareSuccess }) => {
  const [emailToShare, setEmailToShare] = useState("");
  const [isEmailShareLoading, setIsEmailShareLoading] = useState(false);
  const [isCopyLoading, setIsCopyLoading] = useState(false);

  if (!file) return null;

  const API_BASE = "http://3.12.1.104:4000/api/files";
  const shareLink = `${window.location.origin}/share.in/${file._id}`;

  const copyToClipboard = async () => {
    setIsCopyLoading(true);
    try {
      await navigator.clipboard.writeText(shareLink);
      onShareSuccess("Link copied to clipboard!");
    } catch (err) {
      console.error("Error copying to clipboard:", err);
      onShareSuccess("Failed to copy link. Please try again.", true);
    } finally {
      setIsCopyLoading(false);
    }
  };

  const shareViaEmail = async (e) => {
    e.preventDefault();
    if (!emailToShare) return;
    
    setIsEmailShareLoading(true);
    try {
      await axios.post(`${API_BASE}/share/${file._id}`, {
        email: emailToShare
      }, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        }
      });
      onShareSuccess(`File shared with ${emailToShare} successfully!`);
      setEmailToShare("");
      onClose();
    } catch (err) {
      console.error("Error sharing file:", err);
      onShareSuccess("Failed to share file. Please try again.", true);
    } finally {
      setIsEmailShareLoading(false);
    }
  };

  return (
    <div className="modal-backdrop active" onClick={(e) => {
      if (e.target.className === 'modal-backdrop active') onClose();
    }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Share File</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p className="file-to-share">
            <strong>File:</strong> {file.name}
          </p>
          
          <div className="share-link-container">
            <input 
              type="text" 
              className="share-input" 
              value={shareLink} 
              readOnly 
              onClick={(e) => e.target.select()}
            />
            <button 
              className={`copy-btn ${isCopyLoading ? "loading" : ""}`} 
              onClick={copyToClipboard}
              disabled={isCopyLoading}
            >
              {isCopyLoading ? "Copying..." : "Copy Link"}
            </button>
          </div>
          
          <div className="share-options">
            <div className="share-option" onClick={copyToClipboard}>
              <div className="share-option-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </div>
              <div className="share-option-text">Copy Link</div>
            </div>
          </div>
          
          <div className="email-share-form">
            <form onSubmit={shareViaEmail}>
              <div className="filed">
                <label htmlFor="email-share">Share via Email:</label>
                <input 
                  type="email" 
                  id="email-share" 
                  placeholder="recipient@example.com" 
                  value={emailToShare}
                  onChange={(e) => setEmailToShare(e.target.value)}
                  required
                  disabled={isEmailShareLoading}
                />
              </div>
              <div className="send-btn-container">
                <button 
                  type="submit" 
                  className={isEmailShareLoading ? "loading" : ""}
                  disabled={isEmailShareLoading}
                >
                  {isEmailShareLoading ? "Sending..." : "Send Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;