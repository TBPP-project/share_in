import React, { useState } from 'react';

const FolderStructure = ({ files, onSelectFile, onCreateFolder }) => {
  const [folders, setFolders] = useState([
    { id: 'root', name: 'My Files', parentId: null },
    { id: 'recent', name: 'Recent', parentId: null },
    { id: 'shared', name: 'Shared', parentId: null },
  ]);
  const [currentFolder, setCurrentFolder] = useState('root');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Get files for current folder
  const currentFiles = files.filter(file => file.folderId === currentFolder);
  
  // Get subfolders for current folder
  const subFolders = folders.filter(folder => folder.parentId === currentFolder);

  const handleFolderClick = (folderId) => {
    setCurrentFolder(folderId);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName.trim(),
      parentId: currentFolder
    };
    
    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setShowNewFolderInput(false);
    
    if (onCreateFolder) {
      onCreateFolder(newFolder);
    }
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    let currentId = currentFolder;
    
    while (currentId) {
      const folder = folders.find(f => f.id === currentId);
      if (folder) {
        breadcrumbs.unshift(folder);
        currentId = folder.parentId;
      } else {
        break;
      }
    }
    
    return breadcrumbs;
  };

  return (
    <div className="folder-structure">
      {/* Breadcrumb navigation */}
      <div className="breadcrumb">
        {getBreadcrumbs().map((folder, index) => (
          <React.Fragment key={folder.id}>
            {index > 0 && <span className="breadcrumb-separator">/</span>}
            <span 
              className="breadcrumb-item" 
              onClick={() => handleFolderClick(folder.id)}
            >
              {folder.name}
            </span>
          </React.Fragment>
        ))}
      </div>
      
      {/* New folder creation UI */}
      <div className="folder-actions">
        {showNewFolderInput ? (
          <div className="new-folder-input-container">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="new-folder-input"
              autoFocus
            />
            <button 
              onClick={handleCreateFolder}
              className="create-folder-btn"
            >
              Create
            </button>
            <button 
              onClick={() => setShowNewFolderInput(false)}
              className="cancel-folder-btn"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowNewFolderInput(true)}
            className="new-folder-btn"
          >
            <span className="folder-icon">📁</span> New Folder
          </button>
        )}
      </div>
      
      {/* Folders grid */}
      {subFolders.length > 0 && (
        <div className="folders-container">
          <h3 className="section-title">Folders</h3>
          <div className="folders-grid">
            {subFolders.map(folder => (
              <div 
                key={folder.id} 
                className="folder-card"
                onClick={() => handleFolderClick(folder.id)}
              >
                <div className="folder-icon">📁</div>
                <p className="folder-name">{folder.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Files grid - rendered by parent component */}
      {currentFiles.length > 0 && (
        <div className="files-container">
          <h3 className="section-title">Files</h3>
          {/* Files are rendered by the parent component */}
        </div>
      )}
    </div>
  );
};

export default FolderStructure;