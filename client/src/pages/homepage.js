import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import '../style/Homepage.css';

const API_BASE = "http://3.12.1.104:4000/api/files";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [filter, setFilter] = useState("all");

  const getFileType = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (["doc", "docx", "pdf"].includes(ext)) return "Docs";
    if (["xls", "xlsx", "csv"].includes(ext)) return "Sheets";
    if (["mp4", "mp3", "jpg", "png"].includes(ext)) return "Media";
    return "Others";
  };

  const fetchFiles = useCallback(async () => {
    try {
      const res = await axios.get(API_BASE, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      const formattedFiles = res.data['files'].map((file) => ({
        ...file,
        type: file.type,
        fileUrl: file.fileUrl,
        time: new Date(file.createdAt).toLocaleString(),
      }));
      setFiles(formattedFiles);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFileUpload = async (event) => {
    const uploadedFiles = event.target.files;
    const formData = new FormData();
    formData.append("file", uploadedFiles[0]);
    formData.append("name", uploadedFiles[0].name);

    try {
      const r = await axios.post(`${API_BASE}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      console.log(r.data);
      fetchFiles();
    } catch (err) {
      console.error("Error uploading files:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        }
      });
      fetchFiles();
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  const handleShare = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/${id}`,{
        headers:{
          "x-auth-token": localStorage.getItem("token"),
        }

      });

      console.log(res.data);
      console.log(res.status);
      alert(`Download link: ${res.data.fileUrl || "Link not available"}`);
    } catch (err) {
      console.error("Error fetching file details:", err);
    }
  };

  const filteredFiles =
    filter === "all" ? files : files.filter((file) => file.type === filter);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="menu-header">
          <span className="menu-icon">☰</span>
          <h2 className="logo">Share In</h2>
        </div>
        <button className="menu-item active"><p>Dashboard</p></button>
        <button className="menu-item"><p>Settings</p></button>
      </aside>

      {/* Main content */}
      <main className="content">
        {/* Filter buttons */}
        <div className="filter-buttons">
          {["All", "Docs", "Sheets", "Media", "Others"].map((category) => (
            <button
              key={category}
              className={`filter ${filter === category.toLowerCase() ? "active" : ""}`}
              onClick={() => setFilter(category.toLowerCase())}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Upload button */}
        <input type="file" id="fileUpload" multiple hidden onChange={handleFileUpload} />
        <button className="plus-button" onClick={() => document.getElementById("fileUpload").click()}>+</button>

        {/* File list */}
        <div className="file-list">
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file) => (
              <div
                key={file._id}
                className="file-card"
                onClick={() => window.open(`${file.fileUrl}`, "_blank")}
                style={{ cursor: "pointer", position: "relative" }}
              >
                <div className="file-icon">📄</div>
                <p className="file-name">{file.name}</p>
                <p className="file-details">{file.time}</p>
                <p className="file-size">{file.size}</p>

                <div
                  className="dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="file-options"
                    onClick={(e) => {
                      e.stopPropagation();
                      const menu = e.currentTarget.nextSibling;
                      menu.classList.toggle("show");
                    }}
                  >
                    ⋮
                  </button>
                  <div className="dropdown-content">
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        e.target.innerText = "Deleting...";
                        await handleDelete(file._id);
                        e.target.innerText = "Delete";
                      }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        e.target.innerText = "Loading...";
                        await handleShare(file._id);
                        e.target.innerText = "Share";
                      }}
                    >
                      Share
                    </button>
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
