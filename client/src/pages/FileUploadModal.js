import axios from 'axios';
import React, { useRef, useState } from 'react';
import FileUploadProgress from './FileUploadProgress';

const FileUploadModal = ({ onClose, onUploadComplete, currentFolderId = 'root' }) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const API_BASE = "http://3.12.1.104:4000/api/files";

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleRemoveFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const uploadFiles = async () => {
        if (files.length === 0) return;

        setUploading(true);
        let successCount = 0;

        const uploadPromises = files.map(async (file, index) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("name", file.name);
            formData.append("folderId", currentFolderId);

            try {
                const response = await axios.post(`${API_BASE}/upload`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "x-auth-token": localStorage.getItem("token"),
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(prev => ({
                            ...prev,
                            [index]: percentCompleted
                        }));
                    }
                });

                successCount++;
                return response.data;
            } catch (error) {
                console.error(`Error uploading file ${file.name}:`, error);
                return null;
            }
        });

        await Promise.all(uploadPromises);

        setUploading(false);
        onUploadComplete(successCount);

        // Close modal after a short delay to show 100% completion
        setTimeout(() => {
            onClose();
        }, 1000);
    };

    return (
        <div className="modal-backdrop active" onClick={(e) => {
            if (e.target.className === 'modal-backdrop active') onClose();
        }}>
            <div className="modal-content upload-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Upload Files</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    {/* Drop zone */}
                    <div
                        className={`drop-zone ${dragActive ? 'active' : ''}`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <div className="drop-icon">📤</div>
                        <p className="drop-text">
                            {dragActive
                                ? "Drop files here"
                                : "Drag & drop files here or click to browse"}
                        </p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            multiple
                            hidden
                        />
                    </div>

                    {/* Selected files list */}
                    {files.length > 0 && (
                        <div className="selected-files">
                            <h4 className="files-heading">Selected Files ({files.length})</h4>
                            <div className="files-list">
                                {files.map((file, index) => (
                                    <FileUploadProgress
                                        key={`${file.name}-${index}`}
                                        file={file}
                                        progress={uploadProgress[index] || 0}
                                        onCancel={() => handleRemoveFile(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button
                        onClick={onClose}
                        className="cancel-btn"
                        disabled={uploading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={uploadFiles}
                        className={`upload-btn ${uploading ? "loading" : ""}`}
                        disabled={files.length === 0 || uploading}
                    >
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FileUploadModal;