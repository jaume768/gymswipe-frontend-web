'use client';

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import Image from 'next/image';
import './SingleUserView.css';

const SingleUserView = forwardRef(({ user, onDoubleTapLike, onImageSwipe }, ref) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [heartPosition, setHeartPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [touchCount, setTouchCount] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isSwipingImage, setIsSwipingImage] = useState(false);
  
  // Precarga de imágenes
  useEffect(() => {
    if (user?.photos && user.photos.length > 0) {
      user.photos.forEach(photo => {
        const img = new window.Image();
        img.src = photo.url;
      });
    }
  }, [user]);

  // Reset photo index when user changes
  useEffect(() => {
    setCurrentPhotoIndex(0);
  }, [user]);

  // Navegar por las fotos horizontalmente
  const handlePhotoNavigation = (direction) => {
    if (!user.photos || user.photos.length <= 1) return;
    
    if (direction === 'next') {
      setCurrentPhotoIndex((prev) => 
        prev === user.photos.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? user.photos.length - 1 : prev - 1
      );
    }
  };

  // Mostrar animación de corazón
  const showLikeAnimation = () => {
    setShowHeartAnimation(true);
    setTimeout(() => setShowHeartAnimation(false), 1000);
  };

  // Método público para mostrar animación de corazón desde el componente padre
  const showLikeAnimationInCenter = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setHeartPosition({
        x: rect.width / 2,
        y: rect.height / 2
      });
      showLikeAnimation();
    }
  };

  // Exponer método al componente padre
  useImperativeHandle(ref, () => ({
    showLikeAnimationInCenter
  }));

  // Handle touch events for image swiping
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
    setIsSwipingImage(false);

    // Double tap detection
    const now = Date.now();
    if (now - lastTapTime < 300) {
      setTouchCount(prev => prev + 1);
      if (touchCount >= 1) {
        onDoubleTapLike();
        showLikeAnimation();
        setTouchCount(0);
      }
    } else {
      setTouchCount(1);
    }
    setLastTapTime(now);
  };

  const handleTouchMove = (e) => {
    if (!user?.photos || user.photos.length <= 1) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = Math.abs(touch.clientY - touchStartY);
    
    // If horizontal swipe is detected and it's more significant than vertical
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
      setIsSwipingImage(true);
    }
  };

  const handleTouchEnd = (e) => {
    if (!isSwipingImage || !user?.photos || user.photos.length <= 1) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    
    // Minimum swipe distance
    if (Math.abs(deltaX) > 80) {
      if (deltaX > 0) {
        // Swipe right - previous image
        handlePhotoNavigation('prev');
      } else {
        // Swipe left - next image
        handlePhotoNavigation('next');
      }
    }
    
    setIsSwipingImage(false);
  };

  // Handle click on photo areas for navigation
  const handlePhotoClick = (e) => {
    if (!user?.photos || user.photos.length <= 1) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    
    // Left third for previous, right third for next
    if (clickX < width * 0.33) {
      handlePhotoNavigation('prev');
    } else if (clickX > width * 0.67) {
      handlePhotoNavigation('next');
    }
  };

  if (!user) return <div className="single-user-loading">Cargando perfil...</div>;

  return (
    <div 
      ref={containerRef}
      className="single-user-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Foto de perfil con navegación */}
      <div className="photo-container">
        <div 
          className="photo-wrapper"
          onClick={handlePhotoClick}
        >
          <Image 
            src={user.photos && user.photos.length > 0 
              ? user.photos[currentPhotoIndex].url
              : 'https://via.placeholder.com/400x600?text=No+Photo'} 
            alt={`${user.username} photo ${currentPhotoIndex + 1}`}
            className="profile-photo"
            width={400}
            height={600}
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        
        {/* User Header - Hidden now */}
        <div className="user-header">
        </div>

        {/* User Goal Badge */}
        {user.goal && (
          <div className="user-goal">
            <span className="goal-badge">
              <span className="goal-icon">🎯</span>
              {user.goal}
            </span>
          </div>
        )}

        {/* User Info */}
        <div className="user-info">
          <h2 className="username">{user.username}</h2>
          {user.biography && (
            <p className="biography">{user.biography}</p>
          )}
          {user.city && (
            <div className="location">
              <span className="location-icon">📍</span>
              {user.city}
            </div>
          )}
        </div>
        
        {/* Navegación de fotos (indicadores) */}
        {user.photos && user.photos.length > 1 && (
          <div className="photo-indicators">
            {user.photos.map((_, index) => (
              <div 
                key={index}
                className={`photo-indicator ${index === currentPhotoIndex ? 'active' : ''}`}
                onClick={() => setCurrentPhotoIndex(index)}
              />
            ))}
          </div>
        )}
        
        {/* Navegación táctil invisible para móviles */}
        {user.photos && user.photos.length > 1 && (
          <>
            <div className="touch-nav touch-nav-left" />
            <div className="touch-nav touch-nav-right" />
          </>
        )}
        
        {/* Animación de corazón */}
        {showHeartAnimation && (
          <div 
            className="heart-animation"
            style={{ 
              left: `${heartPosition.x}px`, 
              top: `${heartPosition.y}px` 
            }}
          >
            ❤️
          </div>
        )}
      </div>
    </div>
  );
});

SingleUserView.displayName = 'SingleUserView';

export default SingleUserView;
