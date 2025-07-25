import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const pulseGreen = keyframes`
  0% {
    box-shadow: 
      inset 0 0 40px #00ff00,
      0 0 40px #00ff00,
      0 0 80px #00ff00,
      0 0 120px #00ff00;
    opacity: 0;
  }
  20% {
    box-shadow: 
      inset 0 0 60px #00ff00,
      0 0 60px #00ff00,
      0 0 120px #00ff00,
      0 0 160px #00ff00;
    opacity: 1;
  }
  40% {
    box-shadow: 
      inset 0 0 80px #00ff00,
      0 0 80px #00ff00,
      0 0 160px #00ff00,
      0 0 200px #00ff00;
    opacity: 0.8;
  }
  60% {
    box-shadow: 
      inset 0 0 60px #00ff00,
      0 0 60px #00ff00,
      0 0 120px #00ff00,
      0 0 160px #00ff00;
    opacity: 1;
  }
  80% {
    box-shadow: 
      inset 0 0 40px #00ff00,
      0 0 40px #00ff00,
      0 0 80px #00ff00,
      0 0 120px #00ff00;
    opacity: 0.6;
  }
  100% {
    box-shadow: 
      inset 0 0 20px #00ff00,
      0 0 20px #00ff00,
      0 0 40px #00ff00,
      0 0 60px #00ff00;
    opacity: 0;
  }
`;

const FlashOverlay = styled.div<{ $fadeOut: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 9998;
  background: radial-gradient(circle at center, rgba(0, 255, 0, 0.1) 0%, transparent 70%);
  animation: ${pulseGreen} 2s ease-in-out;
  opacity: ${props => props.$fadeOut ? 0 : 1};
  transition: opacity 0.5s ease-out;
`;

const SuccessOverlay = styled.div<{ $fadeOut: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 9999;
  border: 6px solid rgba(0, 255, 0, 0.8);
  animation: ${pulseGreen} 2s ease-in-out;
  opacity: ${props => props.$fadeOut ? 0 : 1};
  transition: opacity 0.5s ease-out;
`;

interface SuccessNeonEffectProps {
  isActive: boolean;
}

const SuccessNeonEffect: React.FC<SuccessNeonEffectProps> = ({ 
  isActive 
}) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isActive) {
      setFadeOut(false);
      
      // Начать затухание через 1.5 секунды (до окончания анимации)
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 1500);

      return () => clearTimeout(fadeTimer);
    }
  }, [isActive]);

  console.log('SuccessNeonEffect render:', { isActive, fadeOut });

  if (!isActive) return null;

  return (
    <>
      <FlashOverlay $fadeOut={fadeOut} />
      <SuccessOverlay $fadeOut={fadeOut} />
    </>
  );
};

export default SuccessNeonEffect;
