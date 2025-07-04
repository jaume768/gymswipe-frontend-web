'use client';

import React, { useState, useRef } from 'react';
import '../RegisterStep.css';

const AdditionalPhotosStep = ({ 
  data, 
  updateData, 
  errors, 
  error 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const maxPhotos = 5;
  const currentPhotos = data.additionalPhotos || [];

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    if (currentPhotos.length + files.length > maxPhotos) {
      setUploadError(`Puedes subir máximo ${maxPhotos} fotos adicionales`);
      return;
    }

    setIsUploading(true);
    setUploadError('');

    const newPhotos = [];

    try {
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setUploadError('Solo se permiten archivos de imagen');
          setIsUploading(false);
          return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          setUploadError('Cada imagen debe ser menor a 5MB');
          setIsUploading(false);
          return;
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        
        newPhotos.push({
          file: file,
          preview: previewUrl,
          uploaded: false,
          id: Date.now() + Math.random()
        });
      }

      // Add new photos to existing ones
      const updatedPhotos = [...currentPhotos, ...newPhotos];
      updateData('additionalPhotos', updatedPhotos);

      // Simulate upload delay
      setTimeout(() => {
        const finalPhotos = updatedPhotos.map(photo => ({
          ...photo,
          uploaded: true
        }));
        updateData('additionalPhotos', finalPhotos);
        setIsUploading(false);
      }, 1500);

    } catch (error) {
      console.error('Error processing images:', error);
      setUploadError('Error al procesar las imágenes');
      setIsUploading(false);
    }

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (photoId) => {
    const updatedPhotos = currentPhotos.filter(photo => {
      if (photo.id === photoId) {
        // Revoke object URL to free memory
        if (photo.preview) {
          URL.revokeObjectURL(photo.preview);
        }
        return false;
      }
      return true;
    });
    updateData('additionalPhotos', updatedPhotos);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const canAddMore = currentPhotos.length < maxPhotos;

  return (
    <div className="register-step">
      <div className="step-header">
        <h1 className="step-title">Fotos adicionales</h1>
        <p className="step-subtitle">
          Agrega hasta {maxPhotos} fotos más para mostrar tu personalidad
        </p>
      </div>

      <div className="step-content">
        <div className="photos-grid">
          {currentPhotos.map((photo) => (
            <div key={photo.id} className="photo-item">
              <img 
                src={photo.preview} 
                alt="Additional photo"
                className="photo-image"
              />
              {!photo.uploaded && (
                <div className="upload-overlay">
                  <div className="spinner"></div>
                </div>
              )}
              <button
                type="button"
                className="remove-photo-btn"
                onClick={() => handleRemovePhoto(photo.id)}
                disabled={isUploading}
              >
                ✕
              </button>
            </div>
          ))}

          {canAddMore && (
            <div className="add-photo-placeholder" onClick={triggerFileInput}>
              <div className="add-icon">📷</div>
              <div className="add-text">Agregar Foto</div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <div className="photo-counter">
          {currentPhotos.length}/{maxPhotos} fotos
        </div>

        {canAddMore && !isUploading && (
          <div className="add-more-section">
            <button
              type="button"
              className="add-more-btn"
              onClick={triggerFileInput}
            >
              + Agregar más fotos
            </button>
          </div>
        )}

        {uploadError && (
          <div className="error-message" style={{ textAlign: 'center', marginTop: '1rem' }}>
            {uploadError}
          </div>
        )}

        {errors.additionalPhotos && (
          <div className="error-message" style={{ textAlign: 'center', marginTop: '1rem' }}>
            {errors.additionalPhotos}
          </div>
        )}

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <div className="step-info">
          <p>
            Las fotos adicionales ayudarán a otros usuarios a conocerte mejor. Puedes omitir este paso si prefieres.
          </p>
          <ul className="photo-tips">
            <li>Muestra diferentes aspectos de tu personalidad</li>
            <li>Incluye fotos en el gym o haciendo actividades</li>
            <li>Evita fotos repetitivas o muy similares</li>
            <li>Todas las imágenes deben ser menores a 5MB</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .photos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          margin: 1.5rem 0;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .photo-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
        }

        .photo-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .upload-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .add-photo-placeholder {
          aspect-ratio: 1;
          border: 2px dashed rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.05);
        }

        .add-photo-placeholder:hover {
          border-color: var(--gradient-purple-start);
          background: rgba(132, 35, 223, 0.1);
          transform: scale(1.02);
        }

        .add-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .add-text {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-white);
          text-align: center;
        }

        .remove-photo-btn {
          position: absolute;
          top: 5px;
          right: 5px;
          width: 24px;
          height: 24px;
          background: rgba(255, 68, 68, 0.9);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          font-size: 0.75rem;
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

        .photo-counter {
          text-align: center;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          margin: 1rem 0;
        }

        .add-more-section {
          display: flex;
          justify-content: center;
          margin: 1.5rem 0;
        }

        .add-more-btn {
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

        .add-more-btn:hover {
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
          .photos-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 0.75rem;
          }
          
          .add-icon {
            font-size: 1.5rem;
          }
          
          .add-text {
            font-size: 0.7rem;
          }
          
          .remove-photo-btn {
            width: 20px;
            height: 20px;
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdditionalPhotosStep;
