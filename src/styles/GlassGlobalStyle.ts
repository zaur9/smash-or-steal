import { createGlobalStyle } from "styled-components";

const GlassGlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');

  * {
    box-sizing: border-box;
  }

  body {
    background: #0a0a0f;
    background-image: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 226, 0.2) 0%, transparent 50%),
      linear-gradient(135deg, #0a0a0f 0%, #1a0f2e 50%, #0f0a1f 100%);
    background-attachment: fixed;
    min-height: 100vh;
    font-family: 'Rajdhani', 'Segoe UI', Arial, sans-serif;
    color: #00ffff;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    position: relative;
  }

  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(90deg, transparent 98%, rgba(0, 255, 255, 0.03) 100%),
      linear-gradient(0deg, transparent 98%, rgba(255, 0, 255, 0.03) 100%);
    background-size: 100px 100px, 100px 100px;
    pointer-events: none;
    z-index: 1;
    /* animation: cyberpunk-grid 20s linear infinite; */ /* Отключено для производительности */
  }

  @keyframes cyberpunk-grid {
    0% { transform: translate(0, 0); }
    100% { transform: translate(100px, 100px); }
  }

  body::-webkit-scrollbar {
    width: 8px;
  }

  body::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #ff00ff, #00ffff);
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }

  body::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
  }

  /* Глобальные неоновые эффекты */
  .neon-glow {
    text-shadow: 
      0 0 5px currentColor,
      0 0 10px currentColor,
      0 0 15px currentColor,
      0 0 20px currentColor;
  }

  .cyberpunk-border {
    position: relative;
    border: 1px solid;
    border-image: linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff) 1;
  }

  .cyberpunk-border::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff);
    border-radius: inherit;
    z-index: -1;
    opacity: 0.3;
    filter: blur(4px);
  }
`;

export default GlassGlobalStyle;
