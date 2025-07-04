import { createGlobalStyle } from "styled-components";

const GlassGlobalStyle = createGlobalStyle`
  body {
    /* background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%); */
    min-height: 100vh;
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    color: #222;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

export default GlassGlobalStyle;
