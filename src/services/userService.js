/**
 * User Service - Servicio para manejo de usuarios
 * Maneja operaciones relacionadas con usuarios, likes, superlikes, etc.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gymder-api-production.up.railway.app/api';

/**
 * Obtiene el token del localStorage
 * @returns {string|null} Token de autenticación
 */
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

/**
 * Dar like a un usuario
 * @param {string} likedUserId - ID del usuario al que se da like
 * @returns {Promise} - Promesa con el resultado del like
 */
export const likeUser = async (likedUserId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/users/like/${likedUserId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al dar like');
    }
    
    return data;
  } catch (error) {
    console.error('Error en likeUser:', error);
    throw error;
  }
};

/**
 * Dar superlike a un usuario
 * @param {string} targetUserId - ID del usuario al que se da superlike
 * @returns {Promise} - Promesa con el resultado del superlike
 */
export const superLikeUser = async (targetUserId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/users/top_like/${targetUserId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al dar superlike');
    }
    
    return data;
  } catch (error) {
    console.error('Error en superLikeUser:', error);
    throw error;
  }
};

/**
 * Obtener usuarios que han dado like al usuario actual
 * @returns {Promise} - Promesa con la lista de usuarios que dieron like
 */
export const getUserLikes = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/users/likes`, {
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
    console.error('Error en getUserLikes:', error);
    throw error;
  }
};

/**
 * Obtener el estado del límite de likes
 * @returns {Promise} - Promesa con el estado del límite de likes
 */
export const getLikeLimitStatus = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/users/like/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener estado del límite de likes');
    }
    
    return data;
  } catch (error) {
    console.error('Error en getLikeLimitStatus:', error);
    throw error;
  }
};

/**
 * Obtener el estado del límite de scroll
 * @returns {Promise} - Promesa con el estado del límite de scroll
 */
export const getScrollLimitStatus = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/users/scroll/limit-status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener estado del límite de scroll');
    }
    
    return data;
  } catch (error) {
    console.error('Error en getScrollLimitStatus:', error);
    throw error;
  }
};

/**
 * Actualizar contador de scroll
 * @param {string} profileId - ID del perfil actual
 * @returns {Promise} - Promesa con el resultado de la actualización
 */
export const updateScrollCount = async (profileId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/users/scroll/update`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ profileId })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar contador de scroll');
    }
    
    return data;
  } catch (error) {
    console.error('Error en updateScrollCount:', error);
    throw error;
  }
};

/**
 * Reportar un usuario
 * @param {string} reportedUserId - ID del usuario a reportar
 * @param {string} reason - Razón del reporte
 * @returns {Promise} - Promesa con el resultado del reporte
 */
export const reportUser = async (reportedUserId, reason) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/users/report/${reportedUserId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason })
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

/**
 * Bloquear un usuario
 * @param {string} targetUserId - ID del usuario a bloquear
 * @returns {Promise} - Promesa con el resultado del bloqueo
 */
export const blockUser = async (targetUserId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/users/block/${targetUserId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al bloquear usuario');
    }
    
    return data;
  } catch (error) {
    console.error('Error en blockUser:', error);
    throw error;
  }
};

/**
 * Desbloquear un usuario
 * @param {string} targetUserId - ID del usuario a desbloquear
 * @returns {Promise} - Promesa con el resultado del desbloqueo
 */
export const unblockUser = async (targetUserId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/users/unblock/${targetUserId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al desbloquear usuario');
    }
    
    return data;
  } catch (error) {
    console.error('Error en unblockUser:', error);
    throw error;
  }
};

/**
 * Obtener usuarios bloqueados
 * @returns {Promise} - Promesa con la lista de usuarios bloqueados
 */
export const getBlockedUsers = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/users/blocked`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener usuarios bloqueados');
    }
    
    return data;
  } catch (error) {
    console.error('Error en getBlockedUsers:', error);
    throw error;
  }
};

/**
 * Obtener perfil de usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise} - Promesa con el perfil del usuario
 */
export const getUserProfile = async (userId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/users/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener perfil de usuario');
    }
    
    return data;
  } catch (error) {
    console.error('Error en getUserProfile:', error);
    throw error;
  }
};

/**
 * Actualizar perfil de usuario
 * @param {Object} profileData - Datos del perfil a actualizar
 * @returns {Promise} - Promesa con el resultado de la actualización
 */
export const updateProfile = async (profileData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar perfil');
    }
    
    return data;
  } catch (error) {
    console.error('Error en updateProfile:', error);
    throw error;
  }
};

/**
 * Cambiar contraseña
 * @param {string} currentPassword - Contraseña actual
 * @param {string} newPassword - Nueva contraseña
 * @returns {Promise} - Promesa con el resultado del cambio
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/users/change-password`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al cambiar contraseña');
    }
    
    return data;
  } catch (error) {
    console.error('Error en changePassword:', error);
    throw error;
  }
};

/**
 * Comprar superlikes
 * @returns {Promise} - Promesa con el resultado de la compra
 */
export const purchaseTopLike = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/users/top_like/purchase`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al comprar superlikes');
    }
    
    return data;
  } catch (error) {
    console.error('Error en purchaseTopLike:', error);
    throw error;
  }
};

/**
 * Suscribirse a premium
 * @returns {Promise} - Promesa con el resultado de la suscripción
 */
export const subscribePremium = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/users/subscribe`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al suscribirse a premium');
    }
    
    return data;
  } catch (error) {
    console.error('Error en subscribePremium:', error);
    throw error;
  }
};

/**
 * Cancelar suscripción premium
 * @returns {Promise} - Promesa con el resultado de la cancelación
 */
export const cancelPremium = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/users/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al cancelar premium');
    }
    
    return data;
  } catch (error) {
    console.error('Error en cancelPremium:', error);
    throw error;
  }
};

/**
 * Registrar token FCM para notificaciones
 * @param {string} fcmToken - Token FCM
 * @returns {Promise} - Promesa con el resultado del registro
 */
export const registerFcmToken = async (fcmToken) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/users/fcm-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: fcmToken })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al registrar token FCM');
    }
    
    return data;
  } catch (error) {
    console.error('Error en registerFcmToken:', error);
    throw error;
  }
};

/**
 * Obtener configuración de notificaciones
 * @returns {Promise} - Promesa con la configuración de notificaciones
 */
export const getNotificationSettings = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/users/notifications`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener configuración de notificaciones');
    }
    
    return data;
  } catch (error) {
    console.error('Error en getNotificationSettings:', error);
    throw error;
  }
};

/**
 * Actualizar configuración de notificación
 * @param {string} setting - Configuración a actualizar
 * @param {boolean} value - Valor de la configuración
 * @returns {Promise} - Promesa con el resultado de la actualización
 */
export const setNotificationSetting = async (setting, value) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/users/notification`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ [setting]: value })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar configuración de notificación');
    }
    
    return data;
  } catch (error) {
    console.error('Error en setNotificationSetting:', error);
    throw error;
  }
};

/**
 * Eliminar cuenta (borrado lógico)
 * @returns {Promise} - Promesa con el resultado de la eliminación
 */
export const deleteAccount = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/users/deleteAccount`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al eliminar cuenta');
    }
    
    return data;
  } catch (error) {
    console.error('Error en deleteAccount:', error);
    throw error;
  }
};

/**
 * Buscar usuarios
 * @param {Object} filters - Filtros de búsqueda
 * @returns {Promise} - Promesa con los resultados de búsqueda
 */
export const searchUsers = async (filters = {}) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const queryParams = new URLSearchParams(filters).toString();
    const url = `${API_URL}/users/search${queryParams ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al buscar usuarios');
    }
    
    return data;
  } catch (error) {
    console.error('Error en searchUsers:', error);
    throw error;
  }
};

// Objeto exportado por defecto con todas las funciones
const userService = {
  likeUser,
  superLikeUser,
  getUserLikes,
  getLikeLimitStatus,
  getScrollLimitStatus,
  updateScrollCount,
  reportUser,
  blockUser,
  unblockUser,
  getBlockedUsers,
  getUserProfile,
  updateProfile,
  changePassword,
  purchaseTopLike,
  subscribePremium,
  cancelPremium,
  registerFcmToken,
  getNotificationSettings,
  setNotificationSetting,
  deleteAccount,
  searchUsers
};

export { userService };
export default userService;
