'use client';

import React from 'react';
import '../RegisterStep.css';

const GenderStep = ({ 
  data, 
  updateData, 
  errors, 
  error 
}) => {
  const genderOptions = [
    { value: 'Masculino', label: 'Masculino', emoji: '♂️' },
    { value: 'Femenino', label: 'Femenino', emoji: '♀️' },
    { value: 'No Binario', label: 'No Binario', emoji: '⚧️' },
    { value: 'Prefiero no decirlo', label: 'Prefiero no decirlo', emoji: '🤐' },
    { value: 'Otro', label: 'Otro', emoji: '❓' }
  ];

  const handleGenderSelect = (selectedGender) => {
    updateData('gender', selectedGender);
  };

  return (
    <div className="register-step">
      <div className="step-header">
        <h1 className="step-title">¿Cuál es tu género?</h1>
        <p className="step-subtitle">
          Esta información será visible en tu perfil
        </p>
      </div>

      <div className="step-content">
        <div className="options-container">
          {genderOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`option-button ${data.gender === option.value ? 'selected' : ''}`}
              onClick={() => handleGenderSelect(option.value)}
            >
              <span className="option-emoji">{option.emoji}</span>
              <span className="option-label">{option.label}</span>
            </button>
          ))}
        </div>

        {errors.gender && (
          <div className="error-message" style={{ textAlign: 'center', marginTop: '1rem' }}>
            {errors.gender}
          </div>
        )}

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <div className="step-info">
          <p>
            Tu género ayudará a otros usuarios a encontrarte más fácilmente
          </p>
        </div>
      </div>

      <style jsx>{`
        .options-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin: 1.5rem 0;
        }

        .option-button {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .option-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-1px);
        }

        .option-button.selected {
          background: linear-gradient(135deg, var(--gradient-purple-start), var(--gradient-purple-end));
          border-color: var(--gradient-purple-start);
          box-shadow: 0 4px 15px rgba(132, 35, 223, 0.3);
        }

        .option-emoji {
          font-size: 1.5rem;
          min-width: 2rem;
          text-align: center;
        }

        .option-label {
          flex: 1;
        }

        @media (max-width: 480px) {
          .option-button {
            padding: 0.875rem 1rem;
            font-size: 0.95rem;
          }
          
          .option-emoji {
            font-size: 1.25rem;
            min-width: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default GenderStep;
