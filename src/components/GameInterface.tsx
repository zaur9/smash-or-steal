import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 0 30px 40px 30px;
  margin: 0 auto;
  max-width: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 600px) {
    max-width: 95vw;
    margin: 0 2.5vw;
    padding: 0 20px 30px 20px;
  }
`;

const PoolDisplay = styled.div`
  position: fixed;
  top: 150px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 101;
  color: #00ffff;
  font-size: 1.8em;
  font-weight: bold;
  text-shadow: 0 0 15px #00ffff;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const WinChanceDisplay = styled.div`
  color: #00ffff;
  font-size: 0.7em;
  font-weight: bold;
  text-shadow: 0 0 10px #00ffff;
  text-align: center;
  margin-top: 5px;
`;

const CyberpunkButtons = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  z-index: 100;
`;

const NeonButton = styled.button`
  background: transparent;
  border: 2px solid #00ffff;
  border-radius: 15px;
  font-family: 'Rajdhani', monospace;
  font-weight: 700;
  font-size: 1.3em;
  padding: 18px 40px;
  width: 100%;
  max-width: 400px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00ffff;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  overflow: hidden;
  
  text-shadow: 0 0 10px #00ffff;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(0, 255, 255, 0.1), 
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    border-color: #ff00ff;
    color: #ff00ff;
    text-shadow: 0 0 15px #ff00ff;
    background: rgba(255, 0, 255, 0.1);
    transform: translateY(-2px);
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: transparent;
    border-color: rgba(100, 100, 100, 0.5);
    color: rgba(100, 100, 100, 0.7);
    cursor: not-allowed;
    text-shadow: none;
    transform: none;
    
    &::before {
      display: none;
    }
  }

  @media (max-width: 600px) {
    padding: 15px 30px;
    font-size: 1.1em;
  }
`;

interface GameInterfaceProps {
  pool: string;
  onSteal: () => void;
  lastWinner: string;
  isActionLoading: boolean;
  currentChance: number;
}

const GameInterface: React.FC<GameInterfaceProps> = React.memo(({
  pool,
  onSteal,
  isActionLoading,
  currentChance,
}) => {
  return (
    <Container>
            <PoolDisplay>
        Pool: {pool} STT
        <WinChanceDisplay>
          Win Chance: {currentChance}%
        </WinChanceDisplay>
      </PoolDisplay>
      
      <CyberpunkButtons>
        <NeonButton
          onClick={onSteal}
          disabled={isActionLoading}
        >
          {isActionLoading ? "PROCESSING..." : "STEAL THE POOL"}
        </NeonButton>
      </CyberpunkButtons>
    </Container>
  );
});

export default GameInterface;