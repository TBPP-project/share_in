import React, { useState } from "react";
import '../style/Homepage.css'


const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [filter, setFilter] = useState("All");

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);

    const newFiles = uploadedFiles.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      time: new Date().toLocaleString(),
      type: getFileType(file.name),
    }));

    setFiles([...files, ...newFiles]);
  };

  const handleDelete = (id) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  const getFileType = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (["doc", "docx", "pdf"].includes(ext)) return "Docs";
    if (["xls", "xlsx", "csv"].includes(ext)) return "Sheets";
    if (["mp4", "mp3", "jpg", "png"].includes(ext)) return "Media";
    return "Others";
  };

  const filteredFiles = filter === "All" ? files : files.filter((file) => file.type === filter);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="menu-header">
          <span className="menu-icon">☰</span>
          <h2 className="logo">Share In</h2>
        </div>
        <button className="menu-item active"> <p>Dashboard</p></button>
        <button className="menu-item"><p>Settings</p></button>
      </aside>

     

      <main className="content">
       
        <div className="filter-buttons">
          {["All", "Docs", "Sheets", "Media", "Others"].map((category) => (
            <button
              key={category}
              className={`filter ${filter === category ? "active" : ""}`}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        
        <input type="file" id="fileUpload" multiple hidden onChange={handleFileUpload} />
        <button className="plus-button" onClick={() => document.getElementById("fileUpload").click()}>+</button>

        {/* File List */}
        <div className="file-list">
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file) => (
              <div key={file.id} className="file-card">
                <div className="file-icon">📄</div>
                <p className="file-name">{file.name}</p>
                <p className="file-details">{file.time}</p>
                <p className="file-size">{file.size}</p>

                {/* Three-dot menu */}
                <div className="dropdown">
                  <button className="file-options">⋮</button>
                  <div className="dropdown-content">
                    <button onClick={() => handleDelete(file.id)}>Delete</button>
                    <button onClick={() => alert("Sharing " + file.name)}>Share</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-files">No files in this category.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

