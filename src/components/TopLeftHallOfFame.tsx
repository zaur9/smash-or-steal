import React from 'react';
import styled from 'styled-components';
import HallOfFame from './HallOfFame';

const HallOfFameContainer = styled.div`
  position: fixed;
  top: 70px; /* Под кнопкой Hall of Fame */
  left: 154px; /* Под второй кнопкой (Hall of Fame) */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 380px;
  z-index: 999;
  max-height: 500px;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    left: 10px;
    top: 120px; /* Под кнопками на мобильных */
    width: calc(100vw - 20px);
    max-width: 360px;
    padding: 16px;
  }
`;

const Title = styled.h3`
  color: #232946;
  font-family: 'Montserrat', sans-serif;
  font-size: 1.2em;
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HallOfFameBlock = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
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
