import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import { UploadCloud, File, AlertTriangle, Play, CheckCircle } from 'lucide-react';

export default function FileUpload({ onDataLoaded, onLoadSampleData }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await processFiles(Array.from(e.target.files));
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  // Parses followers JSON structures
  const parseFollowersJSON = (jsonObj) => {
    const list = [];
    if (!jsonObj) return list;
    
    let targetArray = [];
    if (Array.isArray(jsonObj)) {
      targetArray = jsonObj;
    } else if (jsonObj.relationships_followers && Array.isArray(jsonObj.relationships_followers)) {
      targetArray = jsonObj.relationships_followers;
    } else if (typeof jsonObj === 'object') {
      // Look for any array in the root object (in case Instagram changes the key name)
      for (const key of Object.keys(jsonObj)) {
        if (Array.isArray(jsonObj[key])) {
          targetArray = jsonObj[key];
          break;
        }
      }
    }
    
    if (Array.isArray(targetArray)) {
      targetArray.forEach(item => {
        if (item && item.string_list_data && Array.isArray(item.string_list_data) && item.string_list_data.length > 0) {
          const info = item.string_list_data[0];
          if (info && info.value) {
            list.push({
              username: info.value,
              href: info.href || `https://www.instagram.com/${info.value}`,
              timestamp: info.timestamp ? info.timestamp * 1000 : null
            });
          }
        }
      });
    }
    return list;
  };

  // Parses following JSON structures
  const parseFollowingJSON = (jsonObj) => {
    const list = [];
    if (!jsonObj) return list;
    
    let targetArray = [];
    if (jsonObj.relationships_following && Array.isArray(jsonObj.relationships_following)) {
      targetArray = jsonObj.relationships_following;
    } else if (Array.isArray(jsonObj)) {
      targetArray = jsonObj;
    } else if (typeof jsonObj === 'object') {
      // Look for any array in the root object
      for (const key of Object.keys(jsonObj)) {
        if (Array.isArray(jsonObj[key])) {
          targetArray = jsonObj[key];
          break;
        }
      }
    }
    
    if (Array.isArray(targetArray)) {
      targetArray.forEach(item => {
        if (item && item.string_list_data && Array.isArray(item.string_list_data) && item.string_list_data.length > 0) {
          const info = item.string_list_data[0];
          if (info && info.value) {
            list.push({
              username: info.value,
              href: info.href || `https://www.instagram.com/${info.value}`,
              timestamp: info.timestamp ? info.timestamp * 1000 : null
            });
          }
        }
      });
    }
    return list;
  };

  const processFiles = async (files) => {
    setLoading(true);
    setError(null);
    setStatus('Initializing parser...');
    
    let followersList = [];
    let followingList = [];
    
    try {
      // 1. Process ZIP File
      const zipFile = files.find(f => f.name.endsWith('.zip'));
      if (zipFile) {
        setStatus('Unzipping package (processing locally)...');
        const zip = await JSZip.loadAsync(zipFile);
        
        const followerFiles = [];
        let followingFileKey = null;

        // Resiliently look for JSON files by matching names anywhere in the zip structure
        zip.forEach((relativePath, file) => {
          if (!file.dir && relativePath.endsWith('.json')) {
            const fileName = relativePath.split('/').pop();
            if (fileName.startsWith('followers_') && fileName.endsWith('.json')) {
              followerFiles.push(file);
            } else if (fileName === 'following.json') {
              followingFileKey = file;
            }
          }
        });

        if (followerFiles.length === 0 && !followingFileKey) {
          throw new Error("Could not find any follower or following JSON files inside the ZIP archive. Check if you downloaded in JSON format.");
        }

        setStatus(`Found ${followerFiles.length} follower list(s) and 1 following list inside ZIP. Parsing...`);

        // Parse following
        if (followingFileKey) {
          const followingDataStr = await followingFileKey.async('text');
          try {
            const parsed = JSON.parse(followingDataStr);
            followingList = parseFollowingJSON(parsed);
          } catch (e) {
            console.error('Error parsing following.json:', e);
          }
        }

        // Parse all follower files (can be multiple files for large accounts)
        for (const file of followerFiles) {
          const dataStr = await file.async('text');
          try {
            const parsed = JSON.parse(dataStr);
            followersList = followersList.concat(parseFollowersJSON(parsed));
          } catch (e) {
            console.error(`Error parsing ${file.name}:`, e);
          }
        }
      } 
      // 2. Process loose JSON Files (if they manually extracted the ZIP)
      else {
        setStatus('Reading uploaded JSON files...');
        for (const file of files) {
          if (file.name.endsWith('.json')) {
            const text = await file.text();
            const parsed = JSON.parse(text);
            
            if (file.name.includes('follower')) {
              followersList = followersList.concat(parseFollowersJSON(parsed));
            } else if (file.name.includes('following')) {
              followingList = parseFollowingJSON(parsed);
            }
          }
        }
        
        if (followersList.length === 0 && followingList.length === 0) {
          throw new Error("No valid Instagram follower or following JSON files detected. Please drop the ZIP or files named like 'followers_1.json' and 'following.json'.");
        }
      }

      if (followersList.length === 0 && followingList.length === 0) {
        throw new Error("Parsed lists are empty. Please check if your JSON data files are corrupted or empty.");
      }

      setStatus('Finalizing calculations...');
      onDataLoaded({ followers: followersList, following: followingList });
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while parsing files. Please verify the files and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div 
        className={`glass-panel ${isDragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        style={{
          border: isDragActive ? '2px dashed var(--accent-pink)' : '2px dashed var(--border-color)',
          borderRadius: '24px',
          padding: '4rem 2rem',
          textAlign: 'center',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.3s ease',
          background: isDragActive ? 'rgba(131, 58, 180, 0.05)' : 'var(--surface-color)'
        }}
        onClick={onButtonClick}
      >
        <input 
          ref={fileInputRef}
          type="file"
          multiple
          accept=".zip,.json"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            marginBottom: '0.5rem'
          }}>
            {loading ? (
              <div className="spinner" style={{
                width: '32px',
                height: '32px',
                border: '3px solid rgba(255, 255, 255, 0.1)',
                borderTopColor: 'var(--accent-pink)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            ) : (
              <UploadCloud size={40} style={{ color: 'var(--text-secondary)' }} />
            )}
          </div>

          <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {loading ? 'Processing Data...' : 'Drop your Instagram Data here'}
          </h3>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto', lineHeight: 1.5 }}>
            {loading 
              ? status 
              : 'Drag & drop the downloaded ZIP file directly, or select individual followers_1.json and following.json files.'
            }
          </p>

          {!loading && (
            <button 
              className="glow-btn"
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '50px',
                fontSize: '0.95rem',
                marginTop: '0.5rem'
              }}
              type="button"
            >
              Select File from Device
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="glass-panel animate-fade-in" style={{
          padding: '1.25rem',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          background: 'rgba(244, 63, 94, 0.08)',
          borderRadius: '16px',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start'
        }}>
          <AlertTriangle style={{ color: 'var(--danger-color)', flexShrink: 0, marginTop: '2px' }} size={20} />
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--danger-color)', marginBottom: '0.25rem' }}>
              Error parsing files
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Interactive Quick-Start */}
      <div className="glass-panel animate-fade-in" style={{
        padding: '1.5rem',
        borderRadius: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        background: 'linear-gradient(90deg, rgba(131, 58, 180, 0.05) 0%, rgba(253, 29, 29, 0.02) 100%)'
      }}>
        <div style={{ flex: '1 1 300px' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Play size={18} style={{ color: 'var(--accent-purple)' }} />
            Want a quick test?
          </h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Don't have your Instagram ZIP file ready yet? Click the button to load synthetic sample data and explore how the dashboard works instantly.
          </p>
        </div>
        <button 
          onClick={onLoadSampleData}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            fontWeight: 600,
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: '0.9rem',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.borderColor = 'var(--border-hover)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            e.target.style.borderColor = 'var(--border-color)';
          }}
        >
          Load Demo Data
        </button>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
