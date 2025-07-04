'use client';

import React, { useState, useRef } from 'react';
import '../RegisterStep.css';

const ProfilePhotoStep = ({ 
  data, 
  updateData, 
  errors, 
  error 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('La imagen debe ser menor a 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // For now, just store the file and preview URL
      // In a real implementation, you would upload to your server/cloud storage
      updateData('profilePhoto', {
        file: file,
        preview: previewUrl,
        uploaded: false
      });

      // Simulate upload delay
      setTimeout(() => {
        setIsUploading(false);
        updateData('profilePhoto', {
          ...data.profilePhoto,
          uploaded: true
        });
      }, 1500);

    } catch (error) {
      console.error('Error processing image:', error);
      setUploadError('Error al procesar la imagen');
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    if (data.profilePhoto && data.profilePhoto.preview) {
      URL.revokeObjectURL(data.profilePhoto.preview);
    }
    updateData('profilePhoto', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="register-step">
      <div className="step-header">
        <h1 className="step-title">Foto de perfil</h1>
        <p className="step-subtitle">
          Sube tu mejor foto para tu perfil
        </p>
      </div>

      <div className="step-content">
        <div className="photo-upload-container">
          {data.profilePhoto && data.profilePhoto.preview ? (
            <div className="photo-preview">
              <img 
                src={data.profilePhoto.preview} 
                alt="Profile preview"
                className="preview-image"
              />
              {isUploading && (
                <div className="upload-overlay">
                  <div className="spinner"></div>
                  <span>Subiendo...</span>
                </div>
              )}
              <button
                type="button"
                className="remove-photo-btn"
                onClick={handleRemovePhoto}
                disabled={isUploading}
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="upload-placeholder" onClick={triggerFileInput}>
              <div className="upload-icon">📷</div>
              <div className="upload-text">
                <p className="upload-title">Subir foto</p>
                <p className="upload-subtitle">Toca para seleccionar una imagen</p>
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {data.profilePhoto && !isUploading && (
          <div className="photo-actions">
            <button
              type="button"
              className="change-photo-btn"
              onClick={triggerFileInput}
            >
              Cambiar foto
            </button>
          </div>
        )}

        {uploadError && (
          <div className="error-message" style={{ textAlign: 'center', marginTop: '1rem' }}>
            {uploadError}
          </div>
        )}

        {errors.profilePhoto && (
          <div className="error-message" style={{ textAlign: 'center', marginTop: '1rem' }}>
            {errors.profilePhoto}
          </div>
        )}

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <div className="step-info">
          <p>
            Tu foto de perfil será lo primero que vean otros usuarios. Asegúrate de que sea una foto clara donde se te vea bien.
          </p>
          <ul className="photo-tips">
            <li>Usa una foto reciente donde aparezcas solo/a</li>
            <li>Asegúrate de que tu cara sea claramente visible</li>
            <li>Evita usar filtros excesivos</li>
            <li>La imagen debe ser menor a 5MB</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .photo-upload-container {
          display: flex;
          justify-content: center;
          margin: 2rem 0;
        }

        .upload-placeholder {
          width: 200px;
          height: 200px;
          border: 3px dashed rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.05);
        }

        .upload-placeholder:hover {
          border-color: var(--gradient-purple-start);
          background: rgba(132, 35, 223, 0.1);
          transform: scale(1.02);
        }

        .upload-icon {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }

        .upload-text {
          text-align: center;
        }

        .upload-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-white);
          margin: 0 0 0.25rem 0;
        }

        .upload-subtitle {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .photo-preview {
          position: relative;
          width: 200px;
          height: 200px;
        }

        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid var(--gradient-purple-start);
        }

        .upload-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
        }

        .remove-photo-btn {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 30px;
          height: 30px;
          background: #ff4444;
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .remove-photo-btn:hover {
          background: #cc0000;
          transform: scale(1.1);
        }

        .photo-actions {
          display: flex;
          justify-content: center;
          margin: 1.5rem 0;
        }

        .change-photo-btn {
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-white);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .change-photo-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 0.5rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .photo-tips {
          list-style: none;
          padding: 0;
          margin: 1rem 0 0 0;
        }

        .photo-tips li {
          padding: 0.25rem 0;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
          position: relative;
          padding-left: 1.5rem;
        }

        .photo-tips li:before {
          content: '•';
          color: var(--gradient-purple-start);
          position: absolute;
          left: 0;
          font-weight: bold;
        }

        @media (max-width: 480px) {
          .upload-placeholder,
          .photo-preview {
            width: 150px;
            height: 150px;
          }
          
          .upload-icon {
            font-size: 2.5rem;
          }
          
          .upload-title {
            font-size: 1rem;
          }
          
          .upload-subtitle {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePhotoStep;
