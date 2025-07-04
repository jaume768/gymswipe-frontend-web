'use client';

import React from 'react';
import '../RegisterStep.css';

const FitnessInfoStep = ({ 
  data, 
  updateData, 
  errors, 
  error 
}) => {
  const gymStageOptions = [
    { 
      value: 'Volumen', 
      label: 'Volumen', 
      emoji: '💪',
      description: 'Ganando masa muscular'
    },
    { 
      value: 'Definición', 
      label: 'Definición', 
      emoji: '🔥',
      description: 'Perdiendo grasa corporal'
    },
    { 
      value: 'Mantenimiento', 
      label: 'Mantenimiento', 
      emoji: '⚖️',
      description: 'Manteniendo mi físico actual'
    }
  ];

  const handleGymStageSelect = (stage) => {
    updateData('gymStage', stage);
  };

  const handleHeightChange = (e) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(value) && parseFloat(value) > 0)) {
      updateData('height', value === '' ? null : parseFloat(value));
    }
  };

  const handleWeightChange = (e) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(value) && parseFloat(value) > 0)) {
      updateData('weight', value === '' ? null : parseFloat(value));
    }
  };

  return (
    <div className="register-step">
      <div className="step-header">
        <h1 className="step-title">Tu información fitness</h1>
        <p className="step-subtitle">
          Cuéntanos sobre tu etapa actual en el gym
        </p>
      </div>

      <div className="step-content">
        {/* Gym Stage Selection */}
        <div className="form-section">
          <label className="section-label">¿En qué etapa del gym estás?</label>
          <div className="options-container">
            {gymStageOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`option-button ${data.gymStage === option.value ? 'selected' : ''}`}
                onClick={() => handleGymStageSelect(option.value)}
              >
                <div className="option-main">
                  <span className="option-emoji">{option.emoji}</span>
                  <div className="option-text">
                    <span className="option-label">{option.label}</span>
                    <span className="option-description">{option.description}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {errors.gymStage && (
            <span className="error-message">{errors.gymStage}</span>
          )}
        </div>

        {/* Height and Weight */}
        <div className="measurements-container">
          <div className="form-group">
            <label htmlFor="height" className="form-label">
              Altura (cm)
            </label>
            <input
              id="height"
              type="number"
              className={`form-input ${errors.height ? 'error' : ''}`}
              placeholder="175"
              value={data.height || ''}
              onChange={handleHeightChange}
              min="100"
              max="250"
            />
            {errors.height && (
              <span className="error-message">{errors.height}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="weight" className="form-label">
              Peso (kg)
            </label>
            <input
              id="weight"
              type="number"
              className={`form-input ${errors.weight ? 'error' : ''}`}
              placeholder="70"
              value={data.weight || ''}
              onChange={handleWeightChange}
              min="40"
              max="200"
            />
            {errors.weight && (
              <span className="error-message">{errors.weight}</span>
            )}
          </div>
        </div>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <div className="step-info">
          <p>
            Esta información será visible en tu perfil y ayudará a otros usuarios a conocerte mejor
          </p>
        </div>
      </div>

      <style jsx>{`
        .form-section {
          margin-bottom: 2rem;
        }

        .section-label {
          display: block;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-white);
          margin-bottom: 1rem;
        }

        .options-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .option-button {
          display: flex;
          align-items: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: white;
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

        .option-main {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
        }

        .option-emoji {
          font-size: 1.5rem;
          min-width: 2rem;
          text-align: center;
        }

        .option-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }

        .option-label {
          font-size: 1rem;
          font-weight: 600;
        }

        .option-description {
          font-size: 0.875rem;
          opacity: 0.8;
          line-height: 1.3;
        }

        .measurements-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 480px) {
          .measurements-container {
            grid-template-columns: 1fr;
          }
          
          .option-button {
            padding: 0.875rem;
          }
          
          .option-emoji {
            font-size: 1.25rem;
            min-width: 1.75rem;
          }
          
          .option-label {
            font-size: 0.95rem;
          }
          
          .option-description {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FitnessInfoStep;
