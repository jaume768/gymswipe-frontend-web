'use client';

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';
import { 
  register as registerUser, 
  verifyEmailCode as verifyEmail, 
  checkUsernameAvailability, 
  validatePromoCode,
  checkEmailAvailability,
  sendVerificationEmail
} from '../../services/authService';

// Import steps
import EmailPasswordStep from './steps/EmailPasswordStep';
import EmailVerificationStep from './steps/EmailVerificationStep';
import BasicInfoStep from './steps/BasicInfoStep';
import BirthdateStep from './steps/BirthdateStep';
import GenderStep from './steps/GenderStep';
import SeekingStep from './steps/SeekingStep';
import RelationshipGoalStep from './steps/RelationshipGoalStep';
import LocationStep from './steps/LocationStep';
import FitnessInfoStep from './steps/FitnessInfoStep';
import LiftsStep from './steps/LiftsStep';
import ProfilePhotoStep from './steps/ProfilePhotoStep';
import AdditionalPhotosStep from './steps/AdditionalPhotosStep';

import './RegisterStepper.css';

const RegisterStepper = () => {
  const router = useRouter();
  const { updateUser } = useContext(AuthContext);

  // Current step state
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [promoCodeValid, setPromoCodeValid] = useState(null);
  const [emailAvailable, setEmailAvailable] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    acceptedTerms: false,
    verificationCode: '',
    username: '',
    firstName: '',
    lastName: '',
    promoCode: '',
    birthdate: '',
    gender: '',
    seeking: [],
    relationshipGoal: '',
    location: '',
    gymStage: '',
    height: '',
    weight: '',
    benchPress: '',
    squat: '',
    deadlift: '',
    militaryPress: '',
    profilePhoto: null,
    additionalPhotos: []
  });

  // Update form data helper
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Send verification email
  const handleSendVerificationEmail = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const result = await sendVerificationEmail(formData.email);
      
      if (result.success !== false) {
        return true;
      } else {
        setError(result.message || 'Error al enviar código de verificación');
        return false;
      }
    } catch (error) {
      setError(error.message || 'Error al enviar código de verificación');
      console.error('Send verification error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email verification
  const handleEmailVerification = async (code) => {
    try {
      setIsLoading(true);
      setError('');
      
      const result = await verifyEmail(formData.email, code);
      
      if (result.success !== false) {
        return true;
      } else {
        setError(result.message || 'Código de verificación inválido');
        return false;
      }
    } catch (error) {
      setError(error.message || 'Error al verificar email');
      console.error('Verification error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // API helper functions
  const handleEmailCheck = async (email) => {
    try {
      const available = await checkEmailAvailability(email);
      setEmailAvailable(available);
    } catch (error) {
      console.error('Error checking email:', error);
      setEmailAvailable(false);
    }
  };

  const handleUsernameCheck = async (username) => {
    try {
      const available = await checkUsernameAvailability(username);
      setUsernameAvailable(available);
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameAvailable(false);
    }
  };

  const handlePromoCodeCheck = async (promoCode) => {
    try {
      const valid = await validatePromoCode(promoCode);
      setPromoCodeValid(valid);
    } catch (error) {
      console.error('Error validating promo code:', error);
      setPromoCodeValid(false);
    }
  };

  // Validation functions
  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    switch (stepNumber) {
      case 1:
        if (!formData.email) {
          newErrors.email = 'El email es requerido';
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
          newErrors.email = 'Email inválido';
        }
        
        if (!formData.password) {
          newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
          newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }
        
        if (!formData.acceptedTerms) {
          newErrors.acceptedTerms = 'Debes aceptar los términos y condiciones';
        }
        break;
        
      case 2:
        if (!formData.verificationCode) {
          newErrors.verificationCode = 'El código de verificación es obligatorio';
        } else if (formData.verificationCode.length !== 6) {
          newErrors.verificationCode = 'El código debe tener 6 dígitos';
        }
        break;
        
      case 3:
        if (!formData.username) {
          newErrors.username = 'El nombre de usuario es obligatorio';
        } else if (formData.username.length < 3) {
          newErrors.username = 'El username debe tener al menos 3 caracteres';
        } else if (usernameAvailable === false) {
          newErrors.username = 'Este username no está disponible';
        }
        
        if (!formData.firstName) {
          newErrors.firstName = 'El nombre es obligatorio';
        }
        
        if (!formData.lastName) {
          newErrors.lastName = 'El apellido es obligatorio';
        }
        break;
        
      case 4:
        if (!formData.birthDate) {
          newErrors.birthDate = 'La fecha de nacimiento es obligatoria';
        } else {
          const age = formData.age;
          if (age < 18) {
            newErrors.birthDate = 'Debes ser mayor de 18 años';
          }
        }
        break;
        
      case 5:
        if (!formData.gender) {
          newErrors.gender = 'Selecciona tu género';
        }
        break;
        
      case 6:
        if (!formData.seeking || formData.seeking.length === 0) {
          newErrors.seeking = 'Selecciona al menos una opción';
        }
        break;
        
      case 7:
        if (!formData.relationshipGoal) {
          newErrors.relationshipGoal = 'Selecciona tu objetivo';
        }
        break;
        
      case 9:
        if (!formData.gymStage) {
          newErrors.gymStage = 'Selecciona tu etapa actual';
        }
        
        if (formData.height && (formData.height < 100 || formData.height > 250)) {
          newErrors.height = 'Altura debe estar entre 100 y 250 cm';
        }
        
        if (formData.weight && (formData.weight < 40 || formData.weight > 200)) {
          newErrors.weight = 'Peso debe estar entre 40 y 200 kg';
        }
        break;
        
      case 11:
        if (!formData.profilePhoto) {
          newErrors.profilePhoto = 'La foto de perfil es obligatoria';
        }
        break;
        
      // Steps 8, 10, 12 are optional
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Render step component
  const renderStep = () => {
    const currentStepConfig = {
      component: '',
      title: ''
    };
    
    switch (currentStep) {
      case 1:
        currentStepConfig.component = 'EmailPasswordStep';
        currentStepConfig.title = 'Email y contraseña';
        break;
        
      case 2:
        currentStepConfig.component = 'EmailVerificationStep';
        currentStepConfig.title = 'Verificación de email';
        break;
        
      case 3:
        currentStepConfig.component = 'BasicInfoStep';
        currentStepConfig.title = 'Información básica';
        break;
        
      case 4:
        currentStepConfig.component = 'BirthdateStep';
        currentStepConfig.title = 'Fecha de nacimiento';
        break;
        
      case 5:
        currentStepConfig.component = 'GenderStep';
        currentStepConfig.title = 'Género';
        break;
        
      case 6:
        currentStepConfig.component = 'SeekingStep';
        currentStepConfig.title = 'Buscando';
        break;
        
      case 7:
        currentStepConfig.component = 'RelationshipGoalStep';
        currentStepConfig.title = 'Objetivo de relación';
        break;
        
      case 8:
        currentStepConfig.component = 'LocationStep';
        currentStepConfig.title = 'Ubicación';
        break;
        
      case 9:
        currentStepConfig.component = 'FitnessInfoStep';
        currentStepConfig.title = 'Información de fitness';
        break;
        
      case 10:
        currentStepConfig.component = 'LiftsStep';
        currentStepConfig.title = 'Levantamientos';
        break;
        
      case 11:
        currentStepConfig.component = 'ProfilePhotoStep';
        currentStepConfig.title = 'Foto de perfil';
        break;
        
      case 12:
        currentStepConfig.component = 'AdditionalPhotosStep';
        currentStepConfig.title = 'Fotos adicionales';
        break;
        
      default:
        break;
    }
    
    switch (currentStepConfig.component) {
      case 'EmailPasswordStep':
        return (
          <EmailPasswordStep
            data={formData}
            updateData={updateFormData}
            errors={errors}
            error={error}
            onEmailCheck={handleEmailCheck}
            emailAvailable={emailAvailable}
          />
        );
        
      case 'EmailVerificationStep':
        return (
          <EmailVerificationStep
            data={formData}
            updateData={updateFormData}
            errors={errors}
            error={error}
            onVerify={handleEmailVerification}
            onResendCode={handleEmailRegistration}
          />
        );
        
      case 'BasicInfoStep':
        return (
          <BasicInfoStep
            data={formData}
            updateData={updateFormData}
            errors={errors}
            error={error}
            onUsernameCheck={handleUsernameCheck}
            onPromoCodeCheck={handlePromoCodeCheck}
            usernameAvailable={usernameAvailable}
            promoCodeValid={promoCodeValid}
          />
        );
        
      case 'BirthdateStep':
        return (
          <BirthdateStep
            data={formData}
            updateData={updateFormData}
            errors={errors}
            error={error}
          />
        );
        
      case 'GenderStep':
        return (
          <GenderStep
            data={formData}
            updateData={updateFormData}
            errors={errors}
            error={error}
          />
        );
        
      case 'SeekingStep':
        return (
          <SeekingStep
            data={formData}
            updateData={updateFormData}
            errors={errors}
            error={error}
          />
        );
        
      case 'RelationshipGoalStep':
        return (
          <RelationshipGoalStep
            data={formData}
            updateData={updateFormData}
            errors={errors}
            error={error}
          />
        );
        
      case 'LocationStep':
        return (
          <LocationStep
            data={formData}
            updateData={updateFormData}
            errors={errors}
            error={error}
          />
        );
        
      case 'FitnessInfoStep':
        return (
          <FitnessInfoStep
            data={formData}
            updateData={updateFormData}
            errors={errors}
            error={error}
          />
        );
        
      case 'LiftsStep':
        return (
          <LiftsStep
            data={formData}
            updateData={updateFormData}
            errors={errors}
            error={error}
          />
        );
        
      case 'ProfilePhotoStep':
        return (
          <ProfilePhotoStep
            data={formData}
            updateData={updateFormData}
            errors={errors}
            error={error}
          />
        );
        
      case 'AdditionalPhotosStep':
        return (
          <AdditionalPhotosStep
            data={formData}
            updateData={updateFormData}
            errors={errors}
            error={error}
          />
        );
        
      default:
        return (
          <div className="placeholder-step">
            <h2>Paso {currentStep}: {currentStepConfig.title}</h2>
            <p>Este paso está en desarrollo...</p>
          </div>
        );
    }
  };

  // Next step
  const nextStep = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    // Handle special logic for specific steps
    if (currentStep === 1) {
      // Send verification email
      const success = await handleSendVerificationEmail();
      if (!success) return;
    } else if (currentStep === 2) {
      // Verify email code
      const success = await handleEmailVerification(formData.verificationCode);
      if (!success) return;
    }

    // Move to next step
    if (currentStep < 12) {
      setCurrentStep(currentStep + 1);
      setError('');
      setErrors({});
    }
  };

  // Previous step
  const previousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Submit registration
  const handleSubmitRegistration = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    setError('');

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        seeking: formData.seeking,
        relationshipGoal: formData.relationshipGoal,
        age: formData.age,
        height: formData.height,
        weight: formData.weight,
        gymStage: formData.gymStage,
        ...(formData.lifts && { lifts: formData.lifts }),
        ...(formData.location && {
        }),
        // Promo code if valid
        ...(promoCodeValid && formData.promoCode && { promoCode: formData.promoCode })
      };
      
      console.log('Sending registration data:', registrationData);
      
      const result = await registerUser(registrationData);
      
      if (result.success !== false && result.token) {
        // Save token and user data
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Update user context
        updateUser(result.user);
        
        // TODO: Upload profile photo and additional photos here if needed
        
        // Redirect to dashboard or tutorial
        router.push('/dashboard');
      } else {
        setError(result.message || 'Error en el registro');
        // Handle field errors if present
        if (result.fieldErrors) {
          setErrors(result.fieldErrors);
        }
      }
    } catch (error) {
      setError(error.message || 'Error al registrar usuario');
      console.error('Final registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-stepper">
      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / 12) * 100}%` }}
          />
        </div>
        <span className="progress-text">
          {currentStep} de 12
        </span>
      </div>

      {/* Current Step Component */}
      <div className="step-container">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="navigation-container">
        {currentStep > 1 && (
          <button 
            className="nav-button prev-button"
            onClick={previousStep}
            disabled={isLoading}
          >
            <span className="nav-icon">‹</span>
            Anterior
          </button>
        )}
        
        <div className="nav-spacer" />
        
        {currentStep < 12 ? (
          <button 
            className="nav-button next-button"
            onClick={nextStep}
            disabled={isLoading}
          >
            Siguiente
            <span className="nav-icon">›</span>
          </button>
        ) : (
          <button 
            className="nav-button submit-button"
            onClick={handleSubmitRegistration}
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Finalizar'}
          </button>
        )}
      </div>
    </div>
  );
};

export default RegisterStepper;
