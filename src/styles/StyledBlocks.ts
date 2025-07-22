import styled, { keyframes } from "styled-components";

// Только необходимые анимации
export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const toastShow = keyframes`
  0% { opacity: 0; transform: translateY(30px);}
  10% { opacity: 1; transform: translateY(0);}
  90% { opacity: 1; transform: translateY(0);}
  100% { opacity: 0; transform: translateY(-30px);}
`;

export const Center = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 80px;
  position: relative;
  z-index: 2;
`;

export const TitleBlock = styled.div`
  width: 900px;
  max-width: 95vw;
  background: 
    linear-gradient(135deg, 
      rgba(0, 255, 255, 0.1) 0%, 
      rgba(255, 0, 255, 0.1) 50%, 
      rgba(0, 255, 255, 0.1) 100%
    );
  backdrop-filter: blur(20px);
  border: 2px solid;
  border-image: linear-gradient(45deg, #00ffff, #ff00ff, #00ffff) 1;
  border-radius: 20px;
  padding: 50px 0 40px 0;
  margin-bottom: -40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  position: relative;
  z-index: 2;
  animation: ${fadeIn} 0.8s ease-out;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(0, 255, 255, 0.4), 
      transparent
    );
  }

  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(45deg, #00ffff, #ff00ff, #00ffff);
    border-radius: inherit;
    z-index: -1;
    opacity: 0.3;
    filter: blur(10px);
  }
`;

export const BigTitle = styled.h1`
  font-size: 5.5em;
  background: linear-gradient(45deg, #00ffff, #ff00ff, #00ff41, #ff00ff, #00ffff);
  background-size: 400% 400%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  font-family: 'Orbitron', 'Rajdhani', monospace;
  font-weight: 900;
  letter-spacing: 4px;
  margin: 0;
  text-align: center;
  text-transform: uppercase;
  position: relative;
  animation: 
    neonTextGlow 2s ease-in-out infinite alternate,
    backgroundShift 3s ease-in-out infinite;
  
  @keyframes neonTextGlow {
    from {
      text-shadow: 
        0 0 5px #00ffff,
        0 0 10px #00ffff,
        0 0 15px #00ffff,
        0 0 20px #00ffff,
        0 0 35px #ff00ff,
        0 0 40px #ff00ff;
    }
    to {
      text-shadow: 
        0 0 2px #00ffff,
        0 0 5px #00ffff,
        0 0 8px #00ffff,
        0 0 12px #00ffff,
        0 0 18px #ff00ff,
        0 0 25px #ff00ff;
    }
  }

  @keyframes backgroundShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  &::before {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #00ffff, #ff00ff);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    /* animation: glitchEffect 3s infinite; */ /* Отключено для производительности */
    opacity: 0.7;
    z-index: -1;
  }

  @media (max-width: 768px) {
    font-size: 3.5em;
    letter-spacing: 2px;
  }

  @media (max-width: 480px) {
    font-size: 2.8em;
    letter-spacing: 1px;
  }
`;

export const Emoji = styled.span`
  font-size: 2.7em;
  margin: 0 16px;
  user-select: none;
  color: #00ffff;
  text-shadow: 0 0 10px #00ffff;
  /* animation: neonPulse 2s ease-in-out infinite; */ /* Отключено для производительности */
`;

export const LowerCard = styled.div`
  width: 700px;
  max-width: 98vw;
  margin: 0 auto;
  margin-top: 0;
  background: rgba(44, 24, 85, 0.97);
  border-radius: 0 0 38px 38px / 0 0 100px 100px;
  box-shadow: 0 10px 44px 0 #5d00c933;
  padding: 110px 54px 38px 54px;
  text-align: center;
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 1s;
`;

export const Description = styled.div`
  color: #ffe16b;
  font-family: 'Montserrat', 'Quicksand', Arial, sans-serif;
  font-size: 1.6em;
  font-style: italic;
  line-height: 1.5;
  margin-bottom: 21px;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-shadow: 0 2px 12px #a900ff13;
`;

export const ContractLink = styled.div`
  margin-top: 18px;
  color: #b6a1ea;
  font-size: 1.06em;
  text-align: center;
  i {
    font-style: italic;
  }
  a {
    color: #f9b700;
    text-decoration: underline;
    word-break: break-all;
  }
`;

export const WalletButtonContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 36px;
  z-index: 101;
`;

export const Footer = styled.div`
  position: fixed;
  bottom: 18px;
  left: 0;
  width: 100vw;
  color: #6e5a9b;
  text-align: center;
  font-size: 13px;
  letter-spacing: 0.2px;
  opacity: 0.7;
`;

export const Button = styled.button`
  background: linear-gradient(90deg, #f9b700, #ff2b75, #a900ff, #00e0ff);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1.1em;
  padding: 12px 24px;
  margin: 8px 8px 8px 0;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 16px #0001;
  transition: transform 0.1s;
  &:hover { transform: scale(1.06);}
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const Toast = styled.div`
  position: fixed;
  bottom: 30px;
  left: 30px;
  min-width: 220px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #00ffff;
  border: 2px solid #00ffff;
  border-radius: 8px;
  padding: 14px 24px;
  font-size: 1.12em;
  font-weight: 600;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  z-index: 99999;
  animation: ${toastShow} 10s forwards;
  font-family: 'Montserrat', 'Quicksand', Arial, sans-serif;
  text-align: center;
  text-shadow: 0 0 10px #00ffff;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #ff00ff;
    color: #ff00ff;
    text-shadow: 0 0 15px #ff00ff;
    box-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
  }
`;

export const ProgressBarWrap = styled.div`
  background: #2d214a;
  border-radius: 18px;
  width: 100%;
  height: 24px;
  margin: 18px 0 8px 0;
  overflow: hidden;
  box-shadow: 0 2px 12px #a900ff30;
`;
export const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #f9b700 0%, #ff2b75 50%, #a900ff 100%);
  width: ${props => props.percent}%;
  transition: width 1.2s cubic-bezier(0.5,1,0.7,1);
`;

export const ConfettiWrap = styled.div`
  pointer-events: none;
  position: fixed;
  left: 0; right: 0; top: 0; bottom: 0;
  z-index: 9999;
  overflow: hidden;
`;
export const ConfettiItem = styled.div`
  position: absolute;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${props => props.color};
  opacity: 0.85;
  animation: ${keyframes`
    0% { transform: translateY(0);}
    100% { transform: translateY(90vh) rotate(324deg);}
  `} ${props => props.duration}s linear forwards;
`;

export const PoolValue = styled.div`
  font-size: 1.5em;
  color: #ffe16b;
  margin-bottom: 10px;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

export const StatusWrap = styled.div`
  color: #fff;
  margin: 16px 0;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HallOfFameWrap = styled.div`
  min-height: 66px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

export const LastWinnerWrap = styled.div`
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

/** @type {import('styled-components').StyledComponent<'button', any, { $fullWidth?: boolean }, never>} */
export const GradientButton = styled.button`
  background: rgba(255,255,255,0.13);
  border: 2.5px solid #FFD700;
  border-radius: 20px;
  font-weight: 800;
  font-size: 1.18em;
  padding: 22px 0;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
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
    padding: 14px 0;
    border-radius: 14px;
  }
`;

export const ButtonText = styled.span`
  font-family: 'Montserrat', 'Inter', Arial, sans-serif;
  font-size: 1.18em;
  font-weight: 800;
  color: #232946;
  background: none;
  text-shadow: 0 2px 8px #fff3, 0 1px 0 #23294633;
  user-select: none;
`;

export const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.28);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  backdrop-filter: blur(12px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  padding: 44px 36px 28px 36px;
  margin: 0 auto;
  max-width: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;