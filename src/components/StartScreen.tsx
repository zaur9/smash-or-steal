import React from "react";
import styled from 'styled-components';
import { WalletConnectButton } from './WalletConnectButton';

const CyberpunkCard = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #00ffff;
  border-radius: 8px;
  padding: 54px 36px 44px 36px;
  margin: 0 auto;
  max-width: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
  text-shadow: 0 0 10px #00ffff;
  
  @media (max-width: 600px) {
    max-width: 98vw;
    padding: 18px 4vw 18px 4vw;
  }
`;

const CyberpunkTitle = styled.div`
  font-family: 'Montserrat', 'Inter', Arial, sans-serif;
  font-size: 3em;
  font-weight: 900;
  color: #00ffff;
  text-shadow: 0 0 20px #00ffff;
  padding: 18px 0 12px 0;
  margin-bottom: 44px;
  text-align: center;
  letter-spacing: 0.01em;
  line-height: 1.1;
  border-radius: 12px;
  user-select: none;
  
  .or-text {
    font-weight: 400;
    margin: 0 0.25em;
    color: #ff00ff;
    text-shadow: 0 0 15px #ff00ff;
  }
  
  @media (max-width: 600px) {
    font-size: 2.2em;
  }
`;

const CyberpunkDescription = styled.div`
  color: #00ffff;
  font-family: 'Montserrat', 'Quicksand', Arial, sans-serif;
  font-size: 1.18em;
  font-style: italic;
  line-height: 1.5;
  margin-bottom: 24px;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-align: center;
  text-shadow: 0 0 8px #00ffff;
  
  @media (max-width: 600px) {
    font-size: 1em;
  }
`;

const StartScreen: React.FC<{ onConnect?: () => void }> = () => {
  return (
    <CyberpunkCard>
      <CyberpunkTitle>
        <span>Steal</span>
      </CyberpunkTitle>
      
      <CyberpunkDescription>
        Dare to play? Attempt a bold steal to grab the whole jackpot!<br/>
        Fortune favors the fearless, but one wrong move and you lose it all.<br/>
        Only the bravest make it to the Hall of Fame!
      </CyberpunkDescription>
      
      <WalletConnectButton />
    </CyberpunkCard>
  );
};

export default StartScreen;
