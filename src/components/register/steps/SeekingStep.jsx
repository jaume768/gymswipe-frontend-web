'use client';

import React from 'react';
import '../RegisterStep.css';

const SeekingStep = ({ 
  data, 
  updateData, 
  errors, 
  error 
}) => {
  const seekingOptions = [
    { value: 'Masculino', label: 'Hombres', emoji: '♂️' },
    { value: 'Femenino', label: 'Mujeres', emoji: '♀️' },
    { value: 'No Binario', label: 'No Binarios', emoji: '⚧️' },
    { value: 'Todos', label: 'Todos los géneros', emoji: '🌈' }
  ];

  const handleSeekingToggle = (option) => {
    const currentSeeking = data.seeking || [];
    
    if (option === 'Todos') {
      // If "Todos" is selected, clear all others and set only "Todos"
      if (currentSeeking.includes('Todos')) {
        updateData('seeking', []);
      } else {
        updateData('seeking', ['Todos']);
      }
    } else {
      // If any specific option is selected, remove "Todos" if present
      let newSeeking = currentSeeking.filter(item => item !== 'Todos');
      
      if (newSeeking.includes(option)) {
        newSeeking = newSeeking.filter(item => item !== option);
      } else {
        newSeeking.push(option);
      }
      
      updateData('seeking', newSeeking);
    }
  };

  const isSelected = (option) => {
    return data.seeking && data.seeking.includes(option);
  };

  return (
    <div className="register-step">
      <div className="step-header">
        <h1 className="step-title">¿A quién buscas?</h1>
        <p className="step-subtitle">
          Puedes seleccionar una o más opciones
        </p>
      </div>

      <div className="step-content">
        <div className="options-container">
          {seekingOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`option-button ${isSelected(option.value) ? 'selected' : ''}`}
              onClick={() => handleSeekingToggle(option.value)}
            >
              <span className="option-emoji">{option.emoji}</span>
              <span className="option-label">{option.label}</span>
              <span className="option-check">
                {isSelected(option.value) ? '✓' : ''}
              </span>
            </button>
          ))}
        </div>

        {errors.seeking && (
          <div className="error-message" style={{ textAlign: 'center', marginTop: '1rem' }}>
            {errors.seeking}
          </div>
        )}

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <div className="step-info">
          <p>
            Esta información nos ayudará a mostrarte perfiles que se ajusten a tus preferencias
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
          position: relative;
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

        .option-check {
          font-size: 1.25rem;
          font-weight: bold;
          color: white;
          min-width: 1.5rem;
          text-align: center;
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
          
          .option-check {
            font-size: 1.1rem;
            min-width: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SeekingStep;
