'use client';

import React from 'react';
import '../RegisterStep.css';

const BirthdateStep = ({ 
  data, 
  updateData, 
  errors, 
  error 
}) => {
  const handleDateChange = (e) => {
    const birthDate = e.target.value;
    updateData('birthDate', birthDate);
    
    // Calculate age
    if (birthDate) {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      updateData('age', age);
    }
  };

  // Calculate max date (18 years ago)
  const getMaxDate = () => {
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return eighteenYearsAgo.toISOString().split('T')[0];
  };

  // Calculate min date (100 years ago)
  const getMinDate = () => {
    const today = new Date();
    const hundredYearsAgo = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    return hundredYearsAgo.toISOString().split('T')[0];
  };

  return (
    <div className="register-step">
      <div className="step-header">
        <h1 className="step-title">¿Cuándo naciste?</h1>
        <p className="step-subtitle">
          Tu edad será visible en tu perfil
        </p>
      </div>

      <div className="step-content">
        <div className="form-group">
          <label htmlFor="birthDate" className="form-label">
            Fecha de nacimiento
          </label>
          <input
            id="birthDate"
            type="date"
            className={`form-input ${errors.birthDate ? 'error' : ''}`}
            value={data.birthDate || ''}
            onChange={handleDateChange}
            max={getMaxDate()}
            min={getMinDate()}
            style={{
              fontSize: '1.1rem',
              padding: '1rem',
              colorScheme: 'dark'
            }}
          />
          {errors.birthDate && (
            <span className="error-message">{errors.birthDate}</span>
          )}
          {data.age && (
            <span className="success-message">
              Edad: {data.age} años
            </span>
          )}
        </div>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <div className="step-info">
          <p>
            Debes ser mayor de 18 años para usar GymSwipe. Tu fecha de nacimiento no será visible para otros usuarios, solo tu edad.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BirthdateStep;
