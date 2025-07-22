import React from "react";
import { Toast as ToastStyled } from "../styles/StyledBlocks";

interface ToastProps {
  children: React.ReactNode;
  type?: 'success' | 'error' | 'info';
}

const Toast: React.FC<ToastProps> = ({ children }) => (
  <ToastStyled>
    {children}
  </ToastStyled>
);

export default Toast;
