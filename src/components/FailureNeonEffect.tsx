import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const pulseRed = keyframes`
  0% {
    box-shadow: 
      inset 0 0 40px #ff0000,
      0 0 40px #ff0000,
      0 0 80px #ff0000,
      0 0 120px #ff0000;
    opacity: 0;
  }
  20% {
    box-shadow: 
      inset 0 0 60px #ff0000,
      0 0 60px #ff0000,
      0 0 120px #ff0000,
      0 0 160px #ff0000;
    opacity: 1;
  }
  40% {
    box-shadow: 
      inset 0 0 80px #ff0000,
      0 0 80px #ff0000,
      0 0 160px #ff0000,
      0 0 200px #ff0000;
    opacity: 0.8;
  }
  60% {
    box-shadow: 
      inset 0 0 60px #ff0000,
      0 0 60px #ff0000,
      0 0 120px #ff0000,
      0 0 160px #ff0000;
    opacity: 1;
  }
  80% {
    box-shadow: 
      inset 0 0 40px #ff0000,
      0 0 40px #ff0000,
      0 0 80px #ff0000,
      0 0 120px #ff0000;
    opacity: 0.6;
  }
  100% {
    box-shadow: 
      inset 0 0 20px #ff0000,
      0 0 20px #ff0000,
      0 0 40px #ff0000,
      0 0 60px #ff0000;
    opacity: 0;
  }
`;

const FailureOverlay = styled.div<{ $fadeOut: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 9999;
  border: 6px solid rgba(255, 0, 0, 0.8);
  animation: ${pulseRed} 2s ease-in-out;
  opacity: ${props => props.$fadeOut ? 0 : 1};
  transition: opacity 0.5s ease-out;
`;

const FlashOverlay = styled.div<{ $fadeOut: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 9998;
  background: radial-gradient(circle at center, rgba(255, 0, 0, 0.1) 0%, transparent 70%);
  animation: ${pulseRed} 2s ease-in-out;
  opacity: ${props => props.$fadeOut ? 0 : 1};
  transition: opacity 0.5s ease-out;
`;

interface FailureNeonEffectProps {
  isActive: boolean;
}

const FailureNeonEffect: React.FC<FailureNeonEffectProps> = ({ 
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

  console.log('FailureNeonEffect render:', { isActive, fadeOut });

  if (!isActive) return null;

  return (
    <>
      <FlashOverlay $fadeOut={fadeOut} />
      <FailureOverlay $fadeOut={fadeOut} />
    </>
  );
};

export default FailureNeonEffect;
