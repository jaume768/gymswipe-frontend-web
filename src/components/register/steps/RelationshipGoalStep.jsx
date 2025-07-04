'use client';

import React from 'react';
import '../RegisterStep.css';

const RelationshipGoalStep = ({ 
  data, 
  updateData, 
  errors, 
  error 
}) => {
  const relationshipOptions = [
    { 
      value: 'Amistad', 
      label: 'Amistad', 
      emoji: '🤝',
      description: 'Busco compañeros de gym y amigos'
    },
    { 
      value: 'Relación', 
      label: 'Relación seria', 
      emoji: '💕',
      description: 'Busco una relación a largo plazo'
    },
    { 
      value: 'Casual', 
      label: 'Algo casual', 
      emoji: '😊',
      description: 'Busco conexiones sin compromisos'
    },
    { 
      value: 'Otro', 
      label: 'Otro', 
      emoji: '🤷‍♂️',
      description: 'Estoy abierto a ver qué surge'
    }
  ];

  const handleGoalSelect = (selectedGoal) => {
    updateData('relationshipGoal', selectedGoal);
  };

  return (
    <div className="register-step">
      <div className="step-header">
        <h1 className="step-title">¿Qué buscas?</h1>
        <p className="step-subtitle">
          Esto ayudará a encontrar personas con objetivos similares
        </p>
      </div>

      <div className="step-content">
        <div className="options-container">
          {relationshipOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`option-button ${data.relationshipGoal === option.value ? 'selected' : ''}`}
              onClick={() => handleGoalSelect(option.value)}
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

        {errors.relationshipGoal && (
          <div className="error-message" style={{ textAlign: 'center', marginTop: '1rem' }}>
            {errors.relationshipGoal}
          </div>
        )}

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <div className="step-info">
          <p>
            Puedes cambiar esta preferencia más tarde en tu perfil
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
          padding: 1.25rem;
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
          font-size: 1.75rem;
          min-width: 2.5rem;
          text-align: center;
        }

        .option-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }

        .option-label {
          font-size: 1.1rem;
          font-weight: 600;
        }

        .option-description {
          font-size: 0.9rem;
          opacity: 0.8;
          line-height: 1.3;
        }

        @media (max-width: 480px) {
          .option-button {
            padding: 1rem;
          }
          
          .option-emoji {
            font-size: 1.5rem;
            min-width: 2rem;
          }
          
          .option-label {
            font-size: 1rem;
          }
          
          .option-description {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default RelationshipGoalStep;
