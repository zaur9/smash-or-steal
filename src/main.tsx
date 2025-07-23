import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App';
   import { WagmiProvider } from 'wagmi';
   import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
   import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
   import { config } from './config/wagmi';
   import { createCyberpunkTheme } from './styles/cyberpunkTheme';
   import '@rainbow-me/rainbowkit/styles.css';
   import './styles/rainbowkitCustom.css';

   const queryClient = new QueryClient();

   ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
     <React.StrictMode>
       <WagmiProvider config={config}>
         <QueryClientProvider client={queryClient}>
           <RainbowKitProvider theme={createCyberpunkTheme()}>
             <App />
           </RainbowKitProvider>
         </QueryClientProvider>
       </WagmiProvider>
     </React.StrictMode>
   );