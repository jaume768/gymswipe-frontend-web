'use client';

import React, { useState, useEffect } from 'react';
import '../RegisterStep.css';

const EmailVerificationStep = ({ 
  data, 
  updateData, 
  errors, 
  error, 
  loading,
  onVerifyEmail 
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCodeChange = (e) => {
    const code = e.target.value;
    setVerificationCode(code);
    updateData('verificationCode', code);
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      return;
    }
    
    setIsLoading(true);
    const success = await onVerifyEmail(verificationCode);
    setIsLoading(false);
    
    if (success) {
      // The parent component will handle moving to next step
    }
  };

  // Auto-verify when code is 6 digits
  useEffect(() => {
    if (verificationCode.length === 6) {
      handleVerifyCode();
    }
  }, [verificationCode]);

  return (
    <div className="register-step">
      <div className="step-header">
        <h1 className="step-title">Verifica tu email</h1>
        <p className="step-subtitle">
          Hemos enviado un código de 6 dígitos a<br />
          <strong>{data.email}</strong>
        </p>
      </div>

      <div className="step-content">
        <div className="form-group">
          <label htmlFor="verificationCode" className="form-label">
            Código de verificación
          </label>
          <input
            id="verificationCode"
            type="text"
            className={`form-input ${errors.verificationCode ? 'error' : ''}`}
            placeholder="123456"
            value={verificationCode}
            onChange={handleCodeChange}
            maxLength={6}
            style={{ 
              textAlign: 'center', 
              fontSize: '1.5rem', 
              letterSpacing: '0.5rem',
              fontWeight: 'bold'
            }}
          />
          {errors.verificationCode && (
            <span className="error-message">{errors.verificationCode}</span>
          )}
        </div>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <div className="verification-actions">
          <button
            type="button"
            className="verify-button"
            onClick={handleVerifyCode}
            disabled={!verificationCode || verificationCode.length !== 6 || isLoading || loading}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: verificationCode.length === 6 ? 'var(--gradient-purple-start)' : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: verificationCode.length === 6 ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              opacity: isLoading || loading ? 0.7 : 1
            }}
          >
            {(isLoading || loading) ? 'Verificando...' : 'Verificar código'}
          </button>
        </div>

        <div className="step-info">
          <p>
            Ingresa el código que recibiste por email para continuar
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationStep;
