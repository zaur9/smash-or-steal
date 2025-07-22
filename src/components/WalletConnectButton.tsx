import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import styled from 'styled-components';

const CyberpunkButton = styled.button`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #00ffff;
  border-radius: 8px;
  color: #00ffff;
  padding: 15px 30px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 0 10px #00ffff;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  font-family: 'Montserrat', sans-serif;
  
  &:hover {
    background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
    border-color: #ff00ff;
    color: #ff00ff;
    text-shadow: 0 0 15px #ff00ff;
    box-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 600px) {
    padding: 12px 24px;
    font-size: 1em;
  }
`;

interface WalletConnectButtonProps {
  className?: string;
}

export const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({ className }) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Показываем только после монтирования для предотвращения гидратации
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            className={className}
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <CyberpunkButton onClick={openConnectModal} type="button">
                    Connect Wallet
                  </CyberpunkButton>
                );
              }

              if (chain.unsupported) {
                return (
                  <CyberpunkButton onClick={openChainModal} type="button">
                    Wrong network
                  </CyberpunkButton>
                );
              }

              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <CyberpunkButton
                    onClick={openChainModal}
                    style={{ display: 'flex', alignItems: 'center' }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </CyberpunkButton>

                  <CyberpunkButton onClick={openAccountModal} type="button">
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
                  </CyberpunkButton>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
