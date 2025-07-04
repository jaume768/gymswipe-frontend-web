'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as profileService from '../../services/profileService';
import * as userService from '../../services/userService';
import SingleUserView from '../../components/profiles/SingleUserView';
import './TikTokLikeScreen.css';

const TikTokLikeScreen = () => {
  // Estados principales
  const [users, setUsers] = useState([]);
  const [likedUsers, setLikedUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [showRandom, setShowRandom] = useState(true);

  // Estados de límites
  const [isScrollLimitReached, setIsScrollLimitReached] = useState(false);
  const [isLikeLimitReached, setIsLikeLimitReached] = useState(false);
  const [limitExpirationTime, setLimitExpirationTime] = useState(null);
  const [remainingHours, setRemainingHours] = useState(0);
  const [hasShownScrollLimitDialog, setHasShownScrollLimitDialog] = useState(false);

  // Estados de gestos
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);

  // Estados de control
  const [loadedProfileIds, setLoadedProfileIds] = useState(new Set());
  const [seenProfileIds, setSeenProfileIds] = useState(new Set());

  // Estados de match
  const [matchedUser, setMatchedUser] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  // Referencias
  const containerRef = useRef(null);
  const singleUserViewRef = useRef(null);
  const { user: currentUser, token } = useAuth();

  // Fallback para el token si no llega desde el contexto
  const getToken = () => {
    if (token) return token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  const actualToken = getToken();

  // Parámetros de paginación
  const LIMIT = 20;
  const SWIPE_THRESHOLD = 80;

  // Cargar datos inicial
  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([
          fetchInitialBatch(),
          fetchLikedUsers(),
          checkScrollLimitStatus(),
          checkLikeLimitStatus()
        ]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error in initializeData:', error);
        setIsLoading(false);
      }
    };

    if (actualToken) {
      initializeData();
    }
  }, [actualToken]);

  // Cargar usuarios iniciales
  const fetchInitialBatch = async () => {
    try {
      const response = await profileService.getSuggestedProfiles({}, LIMIT, 0);
      if (response.success) {
        const newUsers = response.matches || [];
        setUsers(newUsers);
        setLoadedProfileIds(new Set(newUsers.map(u => u.id)));
        await markProfilesAsSeen(newUsers.map(u => u.id));
      }
    } catch (error) {
      console.error('Error loading initial batch:', error);
    }
  };

  // Cargar usuarios que te han dado like
  const fetchLikedUsers = async () => {
    try {
      const response = await userService.getUserLikes();
      if (response.success) {
        setLikedUsers(response.usersWhoLiked || []);
      }
    } catch (error) {
      console.error('Error fetching liked users:', error);
    }
  };

  // Verificar estado del límite de scroll
  const checkScrollLimitStatus = async () => {
    try {
      const response = await userService.getScrollLimitStatus();
      if (response.success) {
        setIsScrollLimitReached(response.limitActive || false);
        if (response.limitActive && response.limitInfo) {
          setLimitExpirationTime(new Date(response.limitInfo.limitExpiration));
          setRemainingHours(response.limitInfo.remainingHours || 0);
        }
      }
    } catch (error) {
      console.error('Error checking scroll limit:', error);
    }
  };

  // Verificar estado del límite de likes
  const checkLikeLimitStatus = async () => {
    try {
      const response = await userService.getLikeLimitStatus();
      if (response.success) {
        setIsLikeLimitReached(response.limitActive || false);
      }
    } catch (error) {
      console.error('Error checking like limit:', error);
    }
  };

  // Marcar perfiles como vistos
  const markProfilesAsSeen = async (profileIds) => {
    try {
      await profileService.updateSeenProfiles(profileIds);
      setSeenProfileIds(prev => new Set([...prev, ...profileIds]));
    } catch (error) {
      console.error('Error marking profiles as seen:', error);
    }
  };

  // Actualizar contador de scroll
  const updateScrollCount = async (profileId) => {
    try {
      const response = await userService.updateScrollCount(profileId);
      if (response.success && response.limitReached) {
        setIsScrollLimitReached(true);
        if (response.limitInfo) {
          setLimitExpirationTime(new Date(response.limitInfo.limitExpiration));
          setRemainingHours(response.limitInfo.remainingHours || 0);
        }
        showScrollLimitDialog();
      }
    } catch (error) {
      console.error('Error updating scroll count:', error);
    }
  };

  // Cargar más usuarios
  const fetchMoreUsers = async () => {
    if (isFetchingMore || isScrollLimitReached) return;
    
    setIsFetchingMore(true);
    try {
      const response = await profileService.getSuggestedProfiles({}, LIMIT, users.length);
      if (response.success) {
        const newUsers = response.matches || [];
        const uniqueNewUsers = newUsers.filter(user => 
          !loadedProfileIds.has(user.id)
        );

        if (uniqueNewUsers.length > 0) {
          setUsers(prev => [...prev, ...uniqueNewUsers]);
          setLoadedProfileIds(prev => new Set([...prev, ...uniqueNewUsers.map(u => u.id)]));
          await markProfilesAsSeen(uniqueNewUsers.map(u => u.id));
        }
      }
    } catch (error) {
      console.error('Error fetching more users:', error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  // Manejar swipe (navegación entre perfiles)
  const handleSwipe = async (direction) => {
    if (isProcessing) return;

    const currentList = showRandom ? users : likedUsers;
    if (currentList.length === 0) return;

    let newIndex = currentIndex;
    
    if (direction === 'up' && currentIndex < currentList.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === 'down' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      
      // Actualizar contador de scroll si es necesario
      if (showRandom && !isScrollLimitReached) {
        const currentProfileId = currentList[newIndex]?.id;
        if (currentProfileId) {
          await updateScrollCount(currentProfileId);
        }
      }

      // Cargar más usuarios si estamos cerca del final
      if (showRandom && newIndex >= currentList.length - 3) {
        await fetchMoreUsers();
      }
    }
  };

  // Manejar like
  const handleLike = async () => {
    if (isProcessing) return;
    
    const currentList = showRandom ? users : likedUsers;
    const currentUserProfile = currentList[currentIndex];
    
    if (!currentUserProfile) return;

    // Verificar límite de likes
    if (!currentUser?.isPremium && isLikeLimitReached) {
      showLikeLimitDialog();
      return;
    }

    setIsProcessing(true);
    
    try {
      // Mostrar animación de corazón
      if (singleUserViewRef.current) {
        singleUserViewRef.current.showLikeAnimationInCenter();
      }

      const response = await userService.likeUser(currentUserProfile.id);
      
      if (response.success) {
        // Verificar si hay match
        if (response.matchedUser) {
          setMatchedUser(response.matchedUser);
          setShowMatchModal(true);
        }

        // Remover usuario de la lista
        if (showRandom) {
          setUsers(prev => prev.filter((_, index) => index !== currentIndex));
        } else {
          setLikedUsers(prev => prev.filter((_, index) => index !== currentIndex));
        }

        // Ajustar índice si es necesario
        const newList = showRandom ? 
          users.filter((_, index) => index !== currentIndex) :
          likedUsers.filter((_, index) => index !== currentIndex);
          
        if (currentIndex >= newList.length && newList.length > 0) {
          setCurrentIndex(newList.length - 1);
        }

      } else if (response.limitReached) {
        setIsLikeLimitReached(true);
        if (response.resetAt) {
          setLimitExpirationTime(new Date(response.resetAt));
        }
        showLikeLimitDialog();
      }
    } catch (error) {
      console.error('Error liking user:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Manejar superlike
  const handleSuperLike = async () => {
    if (isProcessing) return;

    const currentList = showRandom ? users : likedUsers;
    const currentUserProfile = currentList[currentIndex];
    
    if (!currentUserProfile) return;

    // Verificar si tiene superlikes
    if (currentUser?.topLikeCount <= 0) {
      showQuickLikeDialog();
      return;
    }

    const confirmed = await showConfirmSuperLike();
    if (!confirmed) return;

    setIsProcessing(true);
    
    try {
      const response = await userService.superLikeUser(currentUserProfile.id);
      
      if (response.success) {
        if (response.matchedUser) {
          setMatchedUser(response.matchedUser);
          setShowMatchModal(true);
        }

        // Remover usuario de la lista
        if (showRandom) {
          setUsers(prev => prev.filter((_, index) => index !== currentIndex));
        } else {
          setLikedUsers(prev => prev.filter((_, index) => index !== currentIndex));
        }

        // Ajustar índice
        const newList = showRandom ? 
          users.filter((_, index) => index !== currentIndex) :
          likedUsers.filter((_, index) => index !== currentIndex);
          
        if (currentIndex >= newList.length && newList.length > 0) {
          setCurrentIndex(newList.length - 1);
        }
      }
    } catch (error) {
      console.error('Error super liking user:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Manejar pass
  const handlePass = async () => {
    if (isProcessing) return;

    const currentList = showRandom ? users : likedUsers;
    
    if (currentList.length === 0) return;

    setIsProcessing(true);
    
    try {
      // Remover usuario de la lista
      if (showRandom) {
        setUsers(prev => prev.filter((_, index) => index !== currentIndex));
      } else {
        setLikedUsers(prev => prev.filter((_, index) => index !== currentIndex));
      }

      // Ajustar índice
      const newList = showRandom ? 
        users.filter((_, index) => index !== currentIndex) :
        likedUsers.filter((_, index) => index !== currentIndex);
        
      if (currentIndex >= newList.length && newList.length > 0) {
        setCurrentIndex(newList.length - 1);
      }

      // Cargar más usuarios si es necesario
      if (showRandom && newList.length <= 3) {
        await fetchMoreUsers();
      }
    } catch (error) {
      console.error('Error passing user:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Eventos de touch
  const handleTouchStart = (e) => {
    if (e.target.closest('.photo-wrapper')) {
      return; // Dejar que SingleUserView maneje la navegación de fotos
    }
    
    const touch = e.touches[0];
    setTouchStartY(touch.clientY);
    setTouchStartX(touch.clientX);
    setIsDragging(false);
    setDragOffset(0);
    setSwipeDirection(null);
  };

  const handleTouchMove = (e) => {
    if (!touchStartY || !touchStartX) return;
    
    if (e.target.closest('.photo-wrapper')) {
      return;
    }
    
    const touch = e.touches[0];
    const deltaY = touch.clientY - touchStartY;
    const deltaX = touch.clientX - touchStartX;
    
    // Determinar dirección desde el primer movimiento significativo
    if (!swipeDirection && (Math.abs(deltaY) > 10 || Math.abs(deltaX) > 10)) {
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        setSwipeDirection('vertical');
        setIsDragging(true);
      } else {
        setSwipeDirection('horizontal');
      }
    }
    
    // Solo procesar movimiento vertical
    if (swipeDirection === 'vertical') {
      setDragOffset(deltaY);
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    // Procesar swipe vertical
    if (swipeDirection === 'vertical' && isDragging && Math.abs(dragOffset) > SWIPE_THRESHOLD) {
      if (dragOffset > 0) {
        handleSwipe('down');
      } else {
        handleSwipe('up');
      }
    }
    
    // Siempre resetear todos los estados
    setIsDragging(false);
    setDragOffset(0);
    setTouchStartY(0);
    setTouchStartX(0);
    setSwipeDirection(null);
  };

  // Limpiar estados de touch si algo queda inconsistente
  useEffect(() => {
    const handleWindowTouchEnd = () => {
      if (isDragging || swipeDirection) {
        setIsDragging(false);
        setDragOffset(0);
        setTouchStartY(0);
        setTouchStartX(0);
        setSwipeDirection(null);
      }
    };

    window.addEventListener('touchend', handleWindowTouchEnd);
    window.addEventListener('touchcancel', handleWindowTouchEnd);
    
    return () => {
      window.removeEventListener('touchend', handleWindowTouchEnd);
      window.removeEventListener('touchcancel', handleWindowTouchEnd);
    };
  }, [isDragging, swipeDirection]);

  // Funciones de diálogos
  const showScrollLimitDialog = () => {
    if (hasShownScrollLimitDialog) return;
    setHasShownScrollLimitDialog(true);
    
    alert(`Función Premium\n\nHas alcanzado el límite de scroll. Quedan ${remainingHours} horas para que se resetee.`);
  };

  const showLikeLimitDialog = () => {
    const hoursLeft = limitExpirationTime ? 
      Math.ceil((limitExpirationTime - new Date()) / (1000 * 60 * 60)) : 0;
    
    alert(`Función Premium\n\nHas alcanzado el límite de likes. Quedan ${hoursLeft} horas para que se resetee.`);
  };

  const showQuickLikeDialog = () => {
    const buyMore = confirm('No tienes QuickLikes\n\n¿Quieres comprar más QuickLikes?');
    if (buyMore) {
      // Navegar a la página de compras
      window.location.href = '/premium';
    }
  };

  const showConfirmSuperLike = () => {
    return new Promise((resolve) => {
      const confirmed = confirm('Confirmar QuickLike\n\n¿Estás seguro de que quieres usar un QuickLike?');
      resolve(confirmed);
    });
  };

  // Cambiar entre modos
  const toggleMode = () => {
    setShowRandom(!showRandom);
    setCurrentIndex(0);
  };

  // Obtener lista actual
  const getCurrentList = () => showRandom ? users : likedUsers;
  const currentList = getCurrentList();
  const currentUserProfile = currentList[currentIndex];

  if (isLoading) {
    return (
      <div className="tiktok-like-screen">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando perfiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tiktok-like-screen">
      <div className="main-content">
        {/* Header dentro del contenido principal */}
        <div className="header">
          <div className="mode-tabs">
            <button 
              className={`tab ${showRandom ? 'active' : ''}`}
              onClick={() => setShowRandom(true)}
            >
              Sugeridos
            </button>
            <button 
              className={`tab ${!showRandom ? 'active' : ''}`}
              onClick={() => setShowRandom(false)}
            >
              Likes ({likedUsers.length})
            </button>
          </div>
        </div>

        {/* Contenedor principal */}
        <div 
          ref={containerRef}
          className="profiles-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {currentList.length === 0 ? (
            <div className="no-users-message">
              <p>{showRandom ? 'No hay más usuarios disponibles' : 'Nadie te ha dado like aún'}</p>
            </div>
          ) : (
            <div 
              className="profile-stack"
              style={{
                transform: isDragging ? `translateY(${dragOffset * 0.5}px)` : 'none',
                transition: isDragging ? 'none' : 'transform 0.3s ease'
              }}
            >
              <div className="profile-card">
                <SingleUserView
                  ref={singleUserViewRef}
                  user={currentUserProfile}
                  onDoubleTapLike={handleLike}
                  onLike={handleLike}
                  onSuperLike={handleSuperLike}
                  onPass={handlePass}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal de Match */}
        {showMatchModal && matchedUser && (
          <div className="match-modal-overlay">
            <div className="match-modal">
              <div className="match-content">
                <h2>¡Es un Match!</h2>
                <div className="match-users">
                  <div className="match-user">
                    <img src={currentUser?.photos?.[0]?.url} alt="Tu foto" />
                    <p>{currentUser?.username}</p>
                  </div>
                  <div className="match-heart">💕</div>
                  <div className="match-user">
                    <img src={matchedUser?.photos?.[0]?.url} alt="Foto del match" />
                    <p>{matchedUser?.username}</p>
                  </div>
                </div>
                <div className="match-actions">
                  <button 
                    className="continue-btn"
                    onClick={() => setShowMatchModal(false)}
                  >
                    Continuar explorando
                  </button>
                  <button 
                    className="chat-btn"
                    onClick={() => {
                      setShowMatchModal(false);
                      window.location.href = `/chat/${matchedUser.id}`;
                    }}
                  >
                    Enviar mensaje
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TikTokLikeScreen;
