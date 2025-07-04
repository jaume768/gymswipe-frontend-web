// Servicio para manejar operaciones relacionadas con perfiles de usuario
import { getToken } from './authService';

const API_URL = 'https://gymder-api-production.up.railway.app/api';

/**
 * Obtiene perfiles sugeridos para el usuario actual
 * @param {Object} filters - Filtros opcionales (edad, peso, altura, etc.)
 * @param {number} limit - Número de perfiles a obtener
 * @param {number} skip - Número de perfiles a saltar (para paginación)
 * @returns {Promise} - Promesa con perfiles sugeridos
 */
export const getSuggestedProfiles = async (filters = {}, limit = 20, skip = 0) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    // Preparar parámetros de consulta
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    queryParams.append('skip', skip.toString());
    
    // Añadir filtros si existen
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        queryParams.append(key, filters[key].toString());
      }
    });

    console.log('Fetching profiles with URL:', `${API_URL}/matches/suggested?${queryParams.toString()}`);
    console.log('Using token:', token ? 'Token present' : 'No token');

    const response = await fetch(`${API_URL}/matches/suggested?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('API Response:', data);
    
    if (!response.ok) {
      console.error('API Error Response:', response.status, data);
      throw new Error(data.message || 'Error al obtener perfiles');
    }
    
    // El backend retorna { success: true, matches: [...] }
    // Convertimos al formato esperado por el frontend
    return {
      matches: data.matches || [],
      success: data.success
    };
  } catch (error) {
    console.error('Error en getSuggestedProfiles:', error);
    throw error;
  }
};

/**
 * Da like a un usuario
 * @param {string} userId - ID del usuario a quien dar like
 * @returns {Promise} - Promesa con el resultado del like
 */
export const likeUser = async (userId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('Liking user:', userId);

    const response = await fetch(`${API_URL}/users/like/${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('Like response:', data);
    
    if (!response.ok) {
      console.error('Like Error Response:', response.status, data);
      throw new Error(data.message || 'Error al dar like');
    }
    
    return data;
  } catch (error) {
    console.error('Error en likeUser:', error);
    throw error;
  }
};

/**
 * Da super like a un usuario (mismo endpoint por ahora)
 * @param {string} userId - ID del usuario a quien dar super like
 * @returns {Promise} - Promesa con el resultado del super like
 */
export const superLikeUser = async (userId) => {
  try {
    // Por ahora usamos el mismo endpoint que el like normal
    // En el futuro se puede crear un endpoint específico para super likes
    return await likeUser(userId);
  } catch (error) {
    console.error('Error en superLikeUser:', error);
    throw error;
  }
};

/**
 * Obtiene usuarios que han dado like al usuario actual
 * @param {number} limit - Número de usuarios a obtener
 * @param {number} skip - Número de usuarios a saltar (para paginación)
 * @returns {Promise} - Promesa con usuarios que dieron like
 */
export const getLikedUsers = async (limit = 20, skip = 0) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    queryParams.append('skip', skip.toString());

    const response = await fetch(`${API_URL}/users/likes?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener usuarios que dieron like');
    }
    
    return data;
  } catch (error) {
    console.error('Error en getLikedUsers:', error);
    throw error;
  }
};

/**
 * Actualiza los perfiles vistos por el usuario
 * @param {string[]} profileIds - Array de IDs de perfiles vistos
 * @returns {Promise} - Promesa con el resultado de la actualización
 */
export const updateSeenProfiles = async (profileIds) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/matches/seen`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ profileIds })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar perfiles vistos');
    }
    
    return data;
  } catch (error) {
    console.error('Error en updateSeenProfiles:', error);
    throw error;
  }
};

/**
 * Reporta un usuario
 * @param {string} userId - ID del usuario a reportar
 * @param {string} reason - Razón del reporte
 * @param {string} details - Detalles adicionales del reporte
 * @returns {Promise} - Promesa con el resultado del reporte
 */
export const reportUser = async (userId, reason, details = '') => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/users/report`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reportedUserId: userId,
        reason,
        details
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al reportar usuario');
    }
    
    return data;
  } catch (error) {
    console.error('Error en reportUser:', error);
    throw error;
  }
};
