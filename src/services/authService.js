// Archivo: authService.js
// Gestiona todas las operaciones relacionadas con la autenticación

const API_URL = 'https://gymder-api-production.up.railway.app/api';

/**
 * Inicia sesión con email/username y contraseña
 * @param {string} identifier - Email o nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise} - Promesa con resultado del login
 */
export const login = async (identifier, password) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: identifier, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }
    
    // Guardar token y datos de usuario en localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

/**
 * Inicia sesión con Google
 * @param {string} googleToken - Token de autenticación de Google
 * @returns {Promise} - Promesa con resultado del login
 */
export const googleLogin = async (googleToken) => {
  try {
    const response = await fetch(`${API_URL}/users/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: googleToken }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión con Google');
    }
    
    // Guardar token y datos de usuario en localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Error en Google login:', error);
    throw error;
  }
};

/**
 * Cierra la sesión del usuario
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} - true si está autenticado, false en caso contrario
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Obtiene el token JWT almacenado
 * @returns {string|null} - Token JWT o null si no existe
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Obtiene los datos del usuario autenticado
 * @returns {Object|null} - Datos del usuario o null si no existe
 */
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Registra un nuevo usuario
 * @param {Object} userData - Datos del usuario para el registro
 * @returns {Promise} - Promesa con resultado del registro
 */
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al registrar usuario');
    }
    
    // Guardar token y datos de usuario en localStorage si el registro es exitoso
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  } catch (error) {
    console.error('Error en register:', error);
    throw error;
  }
};

/**
 * Verifica la disponibilidad de un email
 * @param {string} email - Email a verificar
 * @returns {Promise} - Promesa con el resultado de la verificación
 */
export const checkEmailAvailability = async (email) => {
  try {
    const response = await fetch(`${API_URL}/users/check_email/${email}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al verificar email');
    }
    
    return data;
  } catch (error) {
    console.error('Error en checkEmailAvailability:', error);
    throw error;
  }
};

/**
 * Verifica la disponibilidad de un username
 * @param {string} username - Username a verificar
 * @returns {Promise} - Promesa con el resultado de la verificación
 */
export const checkUsernameAvailability = async (username) => {
  try {
    const response = await fetch(`${API_URL}/users/check_username/${username}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al verificar username');
    }
    
    return data;
  } catch (error) {
    console.error('Error en checkUsernameAvailability:', error);
    throw error;
  }
};

/**
 * Envía un código de verificación por email
 * @param {string} email - Email al que enviar el código
 * @returns {Promise} - Promesa con el resultado del envío
 */
export const sendVerificationEmail = async (email) => {
  try {
    const response = await fetch(`${API_URL}/users/send-verification-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al enviar código de verificación');
    }
    
    return data;
  } catch (error) {
    console.error('Error en sendVerificationEmail:', error);
    throw error;
  }
};

/**
 * Verifica el código de verificación de email
 * @param {string} email - Email del usuario
 * @param {string} code - Código de verificación
 * @returns {Promise} - Promesa con el resultado de la verificación
 */
export const verifyEmailCode = async (email, code) => {
  try {
    const response = await fetch(`${API_URL}/users/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al verificar código');
    }
    
    return data;
  } catch (error) {
    console.error('Error en verifyEmailCode:', error);
    throw error;
  }
};

/**
 * Valida un código promocional
 * @param {string} promoCode - Código promocional a validar
 * @returns {Promise} - Promesa con el resultado de la validación
 */
export const validatePromoCode = async (promoCode) => {
  try {
    const response = await fetch(`${API_URL}/promo-codes/validate/${promoCode}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al validar código promocional');
    }
    
    return data;
  } catch (error) {
    console.error('Error en validatePromoCode:', error);
    throw error;
  }
};
