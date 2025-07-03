import React from "react";
import { Toast as ToastStyled } from "../styles/StyledBlocks";

interface ToastProps {
  children: React.ReactNode;
  type?: 'success' | 'error' | 'info';
}

const icons = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
};

const Toast: React.FC<ToastProps> = ({ children, type = 'info' }) => (
  <ToastStyled>
    {children}
  </ToastStyled>
);

export default Toast;
