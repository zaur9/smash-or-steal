import styled from 'styled-components';

export const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.28);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  backdrop-filter: blur(12px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  padding: 48px 36px 36px 36px;
  margin: 0 auto;
  max-width: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const GlassWallet = styled.div`
  position: fixed;
  top: 18px;
  right: 24px;
  background: rgba(255,255,255,0.85);
  box-shadow: 0 4px 24px 0 rgba(31, 38, 135, 0.18);
  border-radius: 14px;
  padding: 10px 20px;
  color: #222;
  font-weight: 700;
  font-size: 1em;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 0;
  max-width: 220px;
  word-break: break-all;
  cursor: pointer;
  transition: box-shadow 0.2s, background 0.2s;
`;

export const GlassNetworkWarning = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(90deg, #fbc2eb 0%, #a18cd1 100%);
  color: #222;
  text-align: center;
  padding: 14px 0;
  font-weight: 700;
  font-size: 1.1em;
  z-index: 9999;
  box-shadow: 0 2px 12px #a18cd122;
`;

export const ResponsiveGlassCard = styled(GlassCard)`
  @media (max-width: 600px) {
    max-width: 98vw;
    padding: 18px 4vw 18px 4vw;
  }
`;

export const GlassCenter = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
`;
