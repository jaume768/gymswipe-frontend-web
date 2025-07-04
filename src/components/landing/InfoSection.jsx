'use client';

import React from 'react';
import './styles/InfoSection.css';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import Image from 'next/image';

const InfoSection = () => {
  const [sectionRef, isSectionVisible] = useIntersectionObserver({
    threshold: 0.2
  });
  
  return (
    <section 
      id="informacion" 
      className="info-section" 
      ref={sectionRef}
    >
      <div className={`info-container ${isSectionVisible ? 'animate-fade-in visible' : 'animate-fade-in'}`}>

        {/* Tarjeta de "Qué es GymSwipe?" */}
        <div className="info-text">
          <h2 className="info-title">Qué es GymSwipe?</h2>
          <p className="info-description">
            GymSwipe es la app de citas pensada para quienes entrenan, cuidan su cuerpo
            y viven el fitness como un estilo de vida. A diferencia de otras plataformas,
            aquí no solo haces match por una foto, sino por tus objetivos, rutinas y tu
            forma de vivir.
          </p>
        </div>

        {/* Imagen de fondo */}
        <div className="info-image">
          <Image 
            src="/welcome_bg.webp" 
            alt="Background Image" 
            className="welcome-image"
            width={600}
            height={400}
            priority
          />
        </div>

        {/* Tarjeta de "Filtra por objetivos físicos" */}
        <div className="feature-card">
          <h3 className="feature-title">Filtra por objetivos físicos</h3>
          <p className="feature-description">
            Define si estás en fase de volumen, definición o mantenimiento y encuentra
            a gente que siguen tu mismo ritmo.
          </p>
        </div>

      </div>
    </section>
  );
};

export default InfoSection;
