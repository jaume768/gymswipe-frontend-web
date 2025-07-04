'use client';

import React from 'react';
import '../RegisterStep.css';

const LiftsStep = ({ 
  data, 
  updateData, 
  errors, 
  error 
}) => {
  const liftTypes = [
    {
      key: 'benchPress',
      label: 'Press de banca',
      emoji: '🏋️‍♂️',
      placeholder: '80'
    },
    {
      key: 'squat',
      label: 'Sentadilla',
      emoji: '🦵',
      placeholder: '100'
    },
    {
      key: 'deadlift',
      label: 'Peso muerto',
      emoji: '💀',
      placeholder: '120'
    },
    {
      key: 'overheadPress',
      label: 'Press militar',
      emoji: '💪',
      placeholder: '60'
    }
  ];

  const handleLiftChange = (liftKey, value) => {
    const lifts = { ...data.lifts } || {};
    
    if (value === '' || value === null) {
      delete lifts[liftKey];
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue > 0) {
        lifts[liftKey] = numValue;
      }
    }
    
    updateData('lifts', lifts);
  };

  const handleSkipLifts = () => {
    updateData('lifts', {});
  };

  const getLiftValue = (liftKey) => {
    return data.lifts && data.lifts[liftKey] ? data.lifts[liftKey] : '';
  };

  return (
    <div className="register-step">
      <div className="step-header">
        <h1 className="step-title">Tus levantamientos</h1>
        <p className="step-subtitle">
          Comparte tus récords personales (opcional)
        </p>
      </div>

      <div className="step-content">
        <div className="lifts-container">
          {liftTypes.map((lift) => (
            <div key={lift.key} className="lift-group">
              <label className="lift-label">
                <span className="lift-emoji">{lift.emoji}</span>
                <span className="lift-name">{lift.label}</span>
              </label>
              <div className="lift-input-container">
                <input
                  type="number"
                  className={`form-input lift-input ${errors.lifts && errors.lifts[lift.key] ? 'error' : ''}`}
                  placeholder={lift.placeholder}
                  value={getLiftValue(lift.key)}
                  onChange={(e) => handleLiftChange(lift.key, e.target.value)}
                  min="1"
                  max="500"
                />
                <span className="lift-unit">kg</span>
              </div>
              {errors.lifts && errors.lifts[lift.key] && (
                <span className="error-message">{errors.lifts[lift.key]}</span>
              )}
            </div>
          ))}
        </div>

        <div className="skip-section">
          <button
            type="button"
            className="skip-button"
            onClick={handleSkipLifts}
          >
            Omitir por ahora
          </button>
          <p className="skip-text">
            Puedes agregar esta información más tarde en tu perfil
          </p>
        </div>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <div className="step-info">
          <p>
            Tus levantamientos aparecerán en tu perfil y ayudarán a otros usuarios a conocer tu nivel de entrenamiento
          </p>
        </div>
      </div>

      <style jsx>{`
        .lifts-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin: 1.5rem 0 2rem 0;
        }

        .lift-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .lift-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
          color: var(--text-white);
          cursor: pointer;
        }

        .lift-emoji {
          font-size: 1.25rem;
          min-width: 1.5rem;
          text-align: center;
        }

        .lift-name {
          font-size: 1rem;
        }

        .lift-input-container {
          display: flex;
          align-items: center;
          position: relative;
        }

        .lift-input {
          flex: 1;
          padding-right: 3rem !important;
        }

        .lift-unit {
          position: absolute;
          right: 1rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 600;
          pointer-events: none;
        }

        .skip-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          margin: 2rem 0;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .skip-button {
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

        .skip-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .skip-text {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          margin: 0;
        }

        @media (max-width: 480px) {
          .lifts-container {
            gap: 1rem;
          }
          
          .lift-emoji {
            font-size: 1.1rem;
            min-width: 1.25rem;
          }
          
          .lift-name {
            font-size: 0.95rem;
          }
          
          .skip-section {
            padding: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LiftsStep;
