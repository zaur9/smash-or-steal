import React from "react";
import Spinner from "./Spinner";
import ProgressBar from "./ProgressBar";
import styled, { keyframes } from 'styled-components';

const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.22);
  box-shadow: 0 0 32px 8px #FFD70022, 0 2px 24px 0 #23294633;
  backdrop-filter: blur(14px);
  border-radius: 28px;
  border: 2px solid #FFD700;
  padding: 54px 36px 44px 36px;
  margin: 0 auto;
  max-width: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GlassBlock = styled.div`
  background: rgba(255,255,255,0.18);
  box-shadow: 0 4px 24px #a18cd122;
  border-radius: 18px;
  padding: 22px 18px 16px 18px;
  margin-bottom: 28px;
  width: 100%;
  text-align: center;
  min-height: 80px;
  @media (max-width: 600px) {
    padding: 12px 6px 10px 6px;
    border-radius: 12px;
    margin-bottom: 16px;
    min-height: 48px;
  }
`;

const GlassButtons = styled.div`
  display: flex;
  gap: 18px;
  justify-content: center;
  margin: 18px 0 10px 0;
  width: 100%;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 10px;
    margin: 10px 0 6px 0;
  }
`;

const shine = keyframes`
  0% { left: -60%; }
  100% { left: 120%; }
`;

const GradientButton = styled.button`
  background: rgba(255,255,255,0.13);
  border: 2.5px solid #FFD700;
  border-radius: 20px;
  font-weight: 800;
  font-size: 1.18em;
  padding: 22px 0;
  min-width: 210px;
  box-shadow: 0 2px 12px #FFD70022, 0 0 0 2px #fff2 inset;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.1s, border-color 0.2s, background 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #232946;
  text-shadow: 0 2px 8px #fff3, 0 1px 0 #23294633;
  position: relative;
  overflow: hidden;
  margin-bottom: 18px;
  &:hover {
    border-color: #FFD700;
    box-shadow: 0 4px 28px #FFD70055, 0 0 0 2px #fff5 inset;
    background: rgba(255,255,255,0.18);
    color: #fff;
    transform: scale(1.055);
  }
  &:active {
    transform: scale(0.97);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  @media (max-width: 600px) {
    font-size: 1em;
    min-width: 120px;
    padding: 14px 0;
    border-radius: 14px;
  }
`;

const ButtonText = styled.span`
  font-family: 'Montserrat', 'Inter', Arial, sans-serif;
  font-size: 1.18em;
  font-weight: 800;
  color: #232946;
  background: none;
  text-shadow: 0 2px 8px #fff3, 0 1px 0 #23294633;
  user-select: none;
`;

const StatusText = styled.div`
  min-height: 32px;
  margin: 0 0 28px 0;
  color: #18122B;
  font-size: 1.08em;
  text-align: center;
`;

const WinnerBlock = styled(GlassBlock)`
  margin-bottom: 24px;
  background: rgba(255,255,255,0.16);
  border: 1.5px solid #a18cd133;
`;

const HallOfFameBlock = styled(GlassBlock)`
  margin-bottom: 0;
  background: rgba(255,255,255,0.13);
  max-height: 120px;
  overflow-y: auto;
`;

const ResponsiveGlassCard = styled(GlassCard)`
  @media (max-width: 600px) {
    max-width: 99vw;
    padding: 10vw 2vw 8vw 2vw;
    border-radius: 18px;
  }
  @media (max-width: 400px) {
    padding: 4vw 1vw 4vw 1vw;
    border-radius: 12px;
  }
`;

const WinChanceBlock = styled.div`
  width: 100%;
  text-align: center;
  font-weight: 700;
  font-size: 1.18em;
  color: #18122B;
  background: rgba(255,255,255,0.22);
  border: 2.5px solid #E5E4E2;
  border-radius: 16px;
  margin: 0;
  padding: 12px 0 10px 0;
  box-shadow: 0 2px 12px #FFD70022;
  letter-spacing: 0.01em;
  user-select: none;
`;

interface GameInterfaceProps {
  pool: string;
  onSmash: () => void;
  onSteal: () => void;
  status: string;
  lastWinner: string;
  lastWinAmount: string;
  hallOfFame: string[];
  isActionLoading: boolean;
  isFetching: boolean;
  myAddress: string;
  userBalance: string;
  currentChance: number;
}

const GameInterface: React.FC<GameInterfaceProps> = ({
  pool,
  onSmash,
  onSteal,
  status,
  lastWinner,
  lastWinAmount,
  hallOfFame,
  isActionLoading,
  isFetching,
  myAddress,
  userBalance,
  currentChance,
}) => {
  let poolValue = parseFloat(pool);
  let poolPercent = Math.min(100, Math.round(poolValue * 100));
  const noWinner = !lastWinner || lastWinner === "0x0000000000000000000000000000000000000000";
  function shortAddress(addr: string) {
    if (!addr) return '';
    return addr.slice(0, 6) + '...' + addr.slice(-4);
  }
  return (
    <ResponsiveGlassCard>
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 44,
        marginTop: -30,
      }}>
        <div
          style={{
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
          }}
        >
          <span style={{ fontWeight: 900 }}>Smash</span>
          <span style={{ fontWeight: 400, margin: '0 0.25em' }}>or</span>
          <span style={{ fontWeight: 900 }}>Steal</span>
        </div>
      </div>
      <GlassBlock style={{ marginBottom: 44, marginTop: -80 }}>
        <div style={{ fontSize: '1.15em', fontWeight: 700, color: '#18122B', marginBottom: 10 }}>Game pool</div>
        <div style={{ fontSize: '2em', color: '#18122B', fontWeight: 800, marginBottom: 16 }}>{pool} STT</div>
        <div style={{ margin: '0 0 0 0' }}>
          <ProgressBar percent={poolPercent} height={18} borderRadius={12} gradient={['#ffe16b', '#ff2b75', '#a18cd1', '#00cfff']} />
        </div>
      </GlassBlock>
      <GlassButtons style={{ flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        <div style={{ display: 'flex', gap: 18, width: '100%' }}>
          <GradientButton onClick={onSmash} disabled={isActionLoading} style={{ flex: 1 }}>
            <ButtonText>Smash</ButtonText>
          </GradientButton>
          <GradientButton onClick={onSteal} disabled={isActionLoading} style={{ flex: 1 }}>
            <ButtonText>Steal</ButtonText>
          </GradientButton>
        </div>
        <WinChanceBlock>
          Current win chance: <span style={{ color: '#18122B', fontWeight: 900 }}>{currentChance}%</span>
        </WinChanceBlock>
      </GlassButtons>
      <StatusText>
        {isActionLoading
          ? <Spinner />
          : (status === 'Failed to load game data. Please check your connection or try again.' ? null : status)
        }
      </StatusText>
    </ResponsiveGlassCard>
  );
};

export default GameInterface;
