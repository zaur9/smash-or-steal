import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { GradientButton, ButtonText } from '../styles/StyledBlocks';

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
                  <GradientButton onClick={openConnectModal} type="button">
                    <ButtonText>Connect Wallet</ButtonText>
                  </GradientButton>
                );
              }

              if (chain.unsupported) {
                return (
                  <GradientButton onClick={openChainModal} type="button">
                    <ButtonText>Wrong network</ButtonText>
                  </GradientButton>
                );
              }

              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <GradientButton
                    onClick={openChainModal}
                    style={{ display: 'flex', alignItems: 'center' }}
                    type="button"
                  >
                    <ButtonText>
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
                    </ButtonText>
                  </GradientButton>

                  <GradientButton onClick={openAccountModal} type="button">
                    <ButtonText>
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ''}
                    </ButtonText>
                  </GradientButton>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
