import React from 'react';
import styled from 'styled-components';
import HallOfFame from './HallOfFame';

const HallOfFameContainer = styled.div`
  position: fixed;
  top: 70px; /* Под кнопкой Hall of Fame */
  left: 20px; /* Выравниваем с кнопкой */
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 20px;
  box-shadow: none;
  max-width: 400px;
  width: 380px;
  z-index: 999;
  max-height: 500px;
  overflow-y: auto;
  direction: rtl; /* Перемещаем скроллбар влево */
  
  /* Простой кастомный скроллбар */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 255, 255, 0.3);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 255, 255, 0.5);
  }
  
  @media (max-width: 768px) {
    left: 10px;
    top: 80px; /* Под кнопкой на мобильных */
    width: calc(100vw - 20px);
    max-width: 360px;
    padding: 16px;
  }
`;

const Title = styled.h3`
  color: #00ffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.4em;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const HallOfFameBlock = styled.div`
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 16px;
  position: relative;
  direction: ltr; /* Возвращаем нормальное направление текста */
`;

interface TopLeftHallOfFameProps {
  hallOfFame: string[];
  myAddress?: string;
}

const TopLeftHallOfFame: React.FC<TopLeftHallOfFameProps> = ({ hallOfFame, myAddress }) => {
  return (
    <HallOfFameContainer>
      <Title>Hall of Fame</Title>
      <HallOfFameBlock>
        <HallOfFame hallOfFame={hallOfFame.slice(0, 10)} myAddress={myAddress} />
      </HallOfFameBlock>
    </HallOfFameContainer>
  );
};

export default TopLeftHallOfFame;
