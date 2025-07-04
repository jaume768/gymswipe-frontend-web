'use client';

import React, { useState } from 'react';
import '../RegisterStep.css';

const LocationStep = ({ 
  data, 
  updateData, 
  errors, 
  error 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  const handleLocationChange = (e) => {
    updateData('location', e.target.value);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('La geolocalización no está soportada en este navegador');
      return;
    }

    setIsLoading(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding to get address
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=es`
          );
          
          if (response.ok) {
            const data = await response.json();
            const address = `${data.city || data.locality || ''}, ${data.principalSubdivision || ''}, ${data.countryName || ''}`.replace(/^,\s*|,\s*$/g, '');
            
            updateData('location', address);
            updateData('latitude', latitude);
            updateData('longitude', longitude);
          } else {
            throw new Error('Error al obtener la dirección');
          }
        } catch (error) {
          console.error('Geocoding error:', error);
          // Even if geocoding fails, save the coordinates
          updateData('latitude', latitude);
          updateData('longitude', longitude);
          updateData('location', `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
        
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Permiso de ubicación denegado');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Información de ubicación no disponible');
            break;
          case error.TIMEOUT:
            setLocationError('Tiempo de espera agotado al obtener ubicación');
            break;
          default:
            setLocationError('Error desconocido al obtener ubicación');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSkipLocation = () => {
    updateData('location', '');
    updateData('latitude', 0);
    updateData('longitude', 0);
  };

  return (
    <div className="register-step">
      <div className="step-header">
        <h1 className="step-title">¿Dónde estás?</h1>
        <p className="step-subtitle">
          Esto nos ayudará a mostrarte personas cerca de ti
        </p>
      </div>

      <div className="step-content">
        <div className="form-group">
          <label htmlFor="location" className="form-label">
            Ubicación (opcional)
          </label>
          <input
            id="location"
            type="text"
            className={`form-input ${errors.location ? 'error' : ''}`}
            placeholder="Ingresa tu ciudad o dirección"
            value={data.location || ''}
            onChange={handleLocationChange}
          />
          {errors.location && (
            <span className="error-message">{errors.location}</span>
          )}
        </div>

        <div className="location-actions">
          <button
            type="button"
            className="location-button primary"
            onClick={handleGetCurrentLocation}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Obteniendo ubicación...
              </>
            ) : (
              <>
                📍 Usar mi ubicación actual
              </>
            )}
          </button>

          <button
            type="button"
            className="location-button secondary"
            onClick={handleSkipLocation}
          >
            Omitir por ahora
          </button>
        </div>

        {locationError && (
          <div className="error-message" style={{ textAlign: 'center', marginTop: '1rem' }}>
            {locationError}
          </div>
        )}

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <div className="step-info">
          <p>
            Tu ubicación solo será utilizada para mostrarte personas cercanas. Puedes cambiar esta configuración más tarde.
          </p>
        </div>
      </div>

      <style jsx>{`
        .location-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin: 1.5rem 0;
        }

        .location-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 1.25rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .location-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .location-button.primary {
          background: linear-gradient(135deg, var(--gradient-purple-start), var(--gradient-purple-end));
          color: white;
          box-shadow: 0 4px 15px rgba(132, 35, 223, 0.3);
        }

        .location-button.primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(132, 35, 223, 0.4);
        }

        .location-button.secondary {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-white);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .location-button.secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .location-button {
            padding: 0.875rem 1rem;
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LocationStep;
