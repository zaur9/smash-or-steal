import { createGlobalStyle } from "styled-components";

const GlassGlobalStyle = createGlobalStyle`
  body {
    background: #18122B;
    min-height: 100vh;
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    color: #222;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    scrollbar-width: thin;
    scrollbar-color: #FFD700 #18122B;
  }

  body::-webkit-scrollbar {
    width: 10px;
    background: transparent;
  }
  body::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #FFD700 40%, #a900ff 100%);
    border-radius: 8px;
    border: 2px solid #18122B;
  }
  body::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export default GlassGlobalStyle;
