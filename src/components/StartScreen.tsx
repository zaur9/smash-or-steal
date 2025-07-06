import React from "react";
import styled from 'styled-components';
import { CONTRACT_ADDRESS } from "../utils/contract";
import { GlassCard, GradientButton, ButtonText } from '../styles/StyledBlocks';

const Description = styled.div`
  color: #b48aff;
  font-family: 'Montserrat', 'Quicksand', Arial, sans-serif;
  font-size: 1.18em;
  font-style: italic;
  line-height: 1.5;
  margin-bottom: 10px;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-align: center;
  text-shadow: 0 1px 8px #fff5;
`;
const ContractLink = styled.div`
  margin-top: 32px;
  color: #b6a1ea;
  font-size: 0.93em;
  text-align: center;
  opacity: 0.6;
  a { color: #a18cd1; word-break: break-all; text-decoration: underline; }
`;

const StartScreen: React.FC<{ onConnect?: () => void }> = ({ onConnect }) => {
  return (
    <GlassCard style={{
      background: 'rgba(255, 255, 255, 0.22)',
      boxShadow: '0 0 32px 8px #FFD70022, 0 2px 24px 0 #23294633',
      backdropFilter: 'blur(14px)',
      borderRadius: 28,
      border: '2px solid #FFD700',
      padding: '54px 36px 44px 36px',
      margin: '0 auto',
      maxWidth: 480,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{
        fontFamily: "'Montserrat', 'Inter', Arial, sans-serif",
        fontSize: '3em',
        fontWeight: 900,
        color: '#232946',
        textShadow: '0 2px 8px #fff3, 0 1px 0 #23294633',
        padding: '18px 0 12px 0',
        marginBottom: 44,
        textAlign: 'center',
        letterSpacing: '0.01em',
        lineHeight: 1.1,
        borderRadius: 12,
        userSelect: 'none',
      }}>
        <span style={{ fontWeight: 900 }}>Smash</span>
        <span style={{ fontWeight: 400, margin: '0 0.25em' }}>or</span>
        <span style={{ fontWeight: 900 }}>Steal</span>
      </div>
      <div style={{
        color: '#18122B',
        fontFamily: "'Montserrat', 'Quicksand', Arial, sans-serif",
        fontSize: '1.18em',
        fontStyle: 'italic',
        lineHeight: 1.5,
        marginBottom: 24,
        fontWeight: 500,
        letterSpacing: '0.01em',
        textAlign: 'center',
        textShadow: '0 2px 12px #a900ff13',
      }}>
        Dare to play? Smash the pool for an instant win or attempt a bold steal to grab the whole jackpot!<br/>
        Fortune favors the fearless, but one wrong move and you lose it all.<br/>
        Only the bravest make it to the Hall of Fame!
      </div>
      <GradientButton style={{ width: '100%', maxWidth: 260, minHeight: 54, fontSize: '1.18em', margin: '0 0 0 0' }} onClick={onConnect}>
        <ButtonText>Connect MetaMask</ButtonText>
      </GradientButton>
    </GlassCard>
  );
};

export default StartScreen;
