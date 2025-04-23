import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import FileUploadModal from '../components/FileUploadModal';
import FolderStructure from '../components/FolderStructure';
import ShareModal from '../components/ShareModal';
import '../style/FileUpload.css';
import '../style/FolderStructure.css';
import '../style/Homepage.css';

const API_BASE = "http://3.12.1.104:4000/api/files";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isShareLoading, setIsShareLoading] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState('root');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const getFileType = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (["doc", "docx", "pdf"].includes(ext)) return "Docs";
    if (["xls", "xlsx", "csv"].includes(ext)) return "Sheets";
    if (["mp4", "mp3", "jpg", "png"].includes(ext)) return "Media";
    return "Others";
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (["doc", "docx", "pdf"].includes(ext)) return "📄";
    if (["xls", "xlsx", "csv"].includes(ext)) return "📊";
    if (["mp4", "avi", "mov"].includes(ext)) return "🎥";
    if (["mp3", "wav", "flac"].includes(ext)) return "🎵";
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "🖼️";
    return "📁";
  };

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(API_BASE, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      const formattedFiles = res.data['files'].map((file) => ({
        ...file,
        type: getFileType(file.name),
        icon: getFileIcon(file.name),
        fileUrl: file.fileUrl,
        time: new Date(file.createdAt).toLocaleString(),
      }));
      setFiles(formattedFiles);
    } catch (err) {
      console.error("Error fetching files:", err);
      displayToast("Failed to load files. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFileUpload = () => {
    openUploadModal();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        }
      });
      displayToast("File deleted successfully!");
      fetchFiles();
      return true;
    } catch (err) {
      console.error("Error deleting file:", err);
      displayToast("Failed to delete file. Please try again.");
      return false;
    }
  };

  const openShareModal = (file) => {
    setSelectedFile(file);
    setShowShareModal(true);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setSelectedFile(null);
  };

  const openDeleteModal = (file) => {
    setSelectedFile(file);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedFile(null);
  };

  const openUploadModal = () => {
    setShowUploadModal(true);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
  };

  const handleUploadComplete = (successCount) => {
    if (successCount > 0) {
      displayToast(`Successfully uploaded ${successCount} ${successCount === 1 ? 'file' : 'files'}`);
      fetchFiles();
    }
  };

  const handleFolderChange = (folderId) => {
    setCurrentFolderId(folderId);
  };

  const handleCreateFolder = (folder) => {
    displayToast(`Created folder: ${folder.name}`);
    // In a real app, you would save this to the backend
  };

  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const filteredFiles =
    filter === "all" ? files : files.filter((file) => file.type.toLowerCase() === filter);

  // Filter files by current folder
  const currentFolderFiles = filteredFiles.filter(file =>
    file.folderId === currentFolderId || (!file.folderId && currentFolderId === 'root')
  );

  return (
    <>
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="menu-header">
            <span className="menu-icon">☰</span>
            <h2 className="logo">Share In</h2>
          </div>
          <button className="menu-item active">
            <span className="menu-icon">📊</span>
            <p>Dashboard</p>
          </button>
          <button className="menu-item">
            <span className="menu-icon">⚙️</span>
            <p>Settings</p>
          </button>
          <button className="menu-item" onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}>
            <span className="menu-icon">🚪</span>
            <p>Logout</p>
          </button>
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

          {/* Folder Structure */}
          <FolderStructure
            files={filteredFiles}
            onSelectFile={(fileId) => { }}
            onCreateFolder={handleCreateFolder}
          />

          {/* Upload button */}
          <button
            className="plus-button"
            onClick={handleFileUpload}
          >
            +
          </button>

          {/* File list */}
          <div className="file-list">
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading files...</p>
              </div>
            ) : currentFolderFiles.length > 0 ? (
              currentFolderFiles.map((file) => (
                <div
                  key={file._id}
                  className="file-card"
                  onClick={() => window.open(`${file.fileUrl}`, "_blank")}
                >
                  <div className="file-icon">{file.icon}</div>
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
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(file);
                        }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openShareModal(file);
                        }}
                      >
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-files">No files in this folder.</p>
            )}
          </div>
        </main>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          file={selectedFile}
          onClose={closeShareModal}
          onShareSuccess={displayToast}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          file={selectedFile}
          onClose={closeDeleteModal}
          onConfirmDelete={handleDelete}
        />
      )}

      {/* File Upload Modal */}
      {showUploadModal && (
        <FileUploadModal
          onClose={closeUploadModal}
          onUploadComplete={handleUploadComplete}
          currentFolderId={currentFolderId}
        />
      )}

      {/* Toast Notification */}
      <div className={`toast ${showToast ? "visible" : ""}`}>
        {toastMessage}
      </div>
    </>
  );
};

export default Dashboard;