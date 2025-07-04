'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import '../RegisterStep.css';

const EmailPasswordStep = ({ 
  data, 
  updateData, 
  errors, 
  error, 
  onEmailCheck,
  emailAvailable 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (e) => {
    const email = e.target.value;
    updateData('email', email);
    
    // Check email availability when user stops typing
    if (email && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setTimeout(() => onEmailCheck(email), 500);
    }
  };

  const handlePasswordChange = (e) => {
    updateData('password', e.target.value);
  };

  const handleTermsChange = (e) => {
    updateData('acceptedTerms', e.target.checked);
  };

  return (
    <div className="register-step">
      <div className="step-header">
        <h1 className="step-title">¡Bienvenido a GymSwipe!</h1>
        <p className="step-subtitle">
          Crea tu cuenta para empezar a conectar con personas que comparten tu pasión por el fitness
        </p>
      </div>

      <div className="step-content">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`form-input ${errors.email ? 'error' : ''} ${emailAvailable === true ? 'success' : ''}`}
            placeholder="tu@email.com"
            value={data.email}
            onChange={handleEmailChange}
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
          {emailAvailable === true && (
            <span className="success-message">✓ Email disponible</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <div className="input-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Mínimo 6 caracteres"
              value={data.password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              className="input-icon-button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
        </div>

        <div className="form-group">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={data.acceptedTerms}
              onChange={handleTermsChange}
            />
            <span className="checkmark"></span>
            <span className="checkbox-text">
              Acepto los{' '}
              <Link href="/terminos" className="link">
                Términos y Condiciones
              </Link>
              {' '}y la{' '}
              <Link href="/privacidad" className="link">
                Política de Privacidad
              </Link>
            </span>
          </label>
        </div>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <div className="step-info">
          <p>
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="link">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailPasswordStep;
