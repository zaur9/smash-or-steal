import { createGlobalStyle } from "styled-components";
const fancyFont = `'Baloo 2', 'Montserrat', 'Quicksand', 'Segoe UI', Arial, sans-serif`;

const GlobalStyle = createGlobalStyle`
  body {
    background: linear-gradient(135deg, #18122B 0%, #232946 100%);
    margin: 0;
    min-height: 100vh;
    font-family: ${fancyFont};
    color: #f2e9ff;
    display: flex;
    place-items: center;
    min-width: 320px;
    overflow-x: hidden;
  }
  html {
    overflow-x: hidden;
  }
  button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    cursor: pointer;
    transition: border-color 0.25s;
  }
  button:hover {
    border-color: #646cff;
  }
  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
`;
export default GlobalStyle;