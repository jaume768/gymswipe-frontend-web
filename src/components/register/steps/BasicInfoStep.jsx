'use client';

import React, { useState, useEffect } from 'react';
import '../RegisterStep.css';

const BasicInfoStep = ({ 
  data, 
  updateData, 
  errors, 
  error,
  onUsernameCheck,
  onPromoCodeCheck,
  usernameAvailable,
  promoCodeValid
}) => {
  const [usernameTimer, setUsernameTimer] = useState(null);
  const [promoCodeTimer, setPromoCodeTimer] = useState(null);

  const handleUsernameChange = (e) => {
    const username = e.target.value;
    updateData('username', username);
    
    // Clear previous timer
    if (usernameTimer) {
      clearTimeout(usernameTimer);
    }
    
    // Check username availability after user stops typing
    if (username && username.length >= 3) {
      const timer = setTimeout(() => {
        onUsernameCheck(username);
      }, 500);
      setUsernameTimer(timer);
    }
  };

  const handleFirstNameChange = (e) => {
    updateData('firstName', e.target.value);
  };

  const handleLastNameChange = (e) => {
    updateData('lastName', e.target.value);
  };

  const handlePromoCodeChange = (e) => {
    const promoCode = e.target.value;
    updateData('promoCode', promoCode);
    
    // Clear previous timer
    if (promoCodeTimer) {
      clearTimeout(promoCodeTimer);
    }
    
    // Check promo code if not empty
    if (promoCode.trim()) {
      const timer = setTimeout(() => {
        onPromoCodeCheck(promoCode.trim());
      }, 800);
      setPromoCodeTimer(timer);
    }
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (usernameTimer) clearTimeout(usernameTimer);
      if (promoCodeTimer) clearTimeout(promoCodeTimer);
    };
  }, [usernameTimer, promoCodeTimer]);

  return (
    <div className="register-step">
      <div className="step-header">
        <h1 className="step-title">Información básica</h1>
        <p className="step-subtitle">
          Cuéntanos un poco sobre ti
        </p>
      </div>

      <div className="step-content">
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Nombre de usuario
          </label>
          <input
            id="username"
            type="text"
            className={`form-input ${errors.username ? 'error' : ''} ${usernameAvailable === true ? 'success' : ''}`}
            placeholder="tu_username"
            value={data.username}
            onChange={handleUsernameChange}
          />
          {errors.username && (
            <span className="error-message">{errors.username}</span>
          )}
          {usernameAvailable === true && (
            <span className="success-message">✓ Username disponible</span>
          )}
          {usernameAvailable === false && (
            <span className="error-message">❌ Username no disponible</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="firstName" className="form-label">
            Nombre
          </label>
          <input
            id="firstName"
            type="text"
            className={`form-input ${errors.firstName ? 'error' : ''}`}
            placeholder="Tu nombre"
            value={data.firstName}
            onChange={handleFirstNameChange}
          />
          {errors.firstName && (
            <span className="error-message">{errors.firstName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName" className="form-label">
            Apellido
          </label>
          <input
            id="lastName"
            type="text"
            className={`form-input ${errors.lastName ? 'error' : ''}`}
            placeholder="Tu apellido"
            value={data.lastName}
            onChange={handleLastNameChange}
          />
          {errors.lastName && (
            <span className="error-message">{errors.lastName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="promoCode" className="form-label">
            Código promocional (opcional)
          </label>
          <input
            id="promoCode"
            type="text"
            className={`form-input ${errors.promoCode ? 'error' : ''} ${promoCodeValid === true ? 'success' : ''}`}
            placeholder="Código promocional"
            value={data.promoCode}
            onChange={handlePromoCodeChange}
          />
          {errors.promoCode && (
            <span className="error-message">{errors.promoCode}</span>
          )}
          {promoCodeValid === true && (
            <span className="success-message">✓ Código promocional válido</span>
          )}
        </div>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <div className="step-info">
          <p>
            Tu nombre de usuario será visible para otros usuarios. Los nombres solo serán visibles cuando hagan match contigo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
