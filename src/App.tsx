import React, { useState, useEffect, useRef, useMemo } from "react";

import { ethers } from "ethers";
import GameInterface from "./components/GameInterface";
import StartScreen from "./components/StartScreen";
import Toast from "./components/Toast";
import Footer from "./components/Footer";
import TopLeftLeaderboard from "./components/TopLeftLeaderboard";
import TopLeftHallOfFame from "./components/TopLeftHallOfFame";
import { useGameData } from './hooks/useGameData';
import GlassGlobalStyle from './styles/GlassGlobalStyle';
import {
  GlassNetworkWarning,
  ResponsiveGlassCard,
  GlassCenter
} from './styles/AppBlocks';
import { shortAddress } from './utils/shortAddress';
import { getToastMessage } from './utils/toastMessages';
import { useWalletV2 } from './hooks/useWalletV2';
import styled from 'styled-components';

// Контейнер для кнопок в левом верхнем углу
const TopLeftButtonsContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  gap: 10px;
  z-index: 1000;
  
  @media (max-width: 768px) {
    left: 10px;
    gap: 8px;
  }
`;

// Кнопка для левого верхнего угла
const TopLeftButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: white;
  padding: 12px 16px;
  font-size: 0.85em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 0.8em;
  }
`;

// Кнопка кошелька в правом верхнем углу
const WalletButton = styled(TopLeftButton)`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 14px;
  z-index: 1000;
  
  span:first-child {
    font-size: 0.9em;
    font-weight: 700;
  }
  
  span:last-child {
    font-size: 0.75em;
    opacity: 0.8;
    font-weight: 400;
  }
  
  @media (max-width: 768px) {
    right: 10px;
    padding: 8px 12px;
  }
`;

// Выпадающее меню для кошелька
const WalletDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #e53935 0%, #c62828 100%);
  border-radius: 8px;
  padding: 8px;
  margin-top: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 10001;
  
  button {
    width: 100%;
    background: none;
    border: none;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8em;
    font-weight: 600;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

// Для поддержки window.ethereum
interface EthereumProvider extends Record<string, unknown> {
  isMetaMask?: boolean;
  request?: (request: { method: string; params?: any[] | Record<string, any> }) => Promise<any>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
}
declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}



const App: React.FC = () => {
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showDisconnectMenu, setShowDisconnectMenu] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showHallOfFame, setShowHallOfFame] = useState(false);
  const [lastTransactionHash, setLastTransactionHash] = useState<string | null>(null);
  const disconnectMenuRef = useRef<HTMLDivElement | null>(null);

  const showToast = (msgKey: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMsg({ text: getToastMessage(msgKey), type });
    setTimeout(() => setToastMsg(null), 10000);
  };

  const {
    contract,
    walletConnected,
    myAddress,
    networkWarning,
    connectWallet,
    disconnectWallet,
    setNetworkWarning
  } = useWalletV2(showToast);

  const {
    pool,
    lastWinner,
    lastWinAmount,
    hallOfFame,
    status,
    isFetching,
    hasLoadedOnce,
    isInitializing,
    setStatus,

    fetchData,
    userBalance,
    currentChance,
  } = useGameData(contract, myAddress);

  useEffect(() => {

    if (contract) {
      fetchData();
    }
    if (window.ethereum && typeof window.ethereum.on === 'function') {
      const handleChainChanged = () => {
        setStatus('');
        setShowConfetti(false);
        setNetworkWarning('Please switch to Somnia Testnet in MetaMask to continue playing.');
        showToast('Please switch to Somnia Testnet in MetaMask.', 'error');
      };
      window.ethereum.on('chainChanged', handleChainChanged);
      return () => {
        if (window.ethereum && typeof window.ethereum.removeListener === 'function') {
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }

  }, [contract]);

  useEffect(() => {
    if (!showDisconnectMenu) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (disconnectMenuRef.current && !disconnectMenuRef.current.contains(event.target as Node)) {
        setShowDisconnectMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDisconnectMenu]);

  const handleSmash = async () => {
    if (!contract) return;
    setIsActionLoading(true);
    setStatus("Sending Smash...");
    try {
      const tx = await contract.smash({ value: ethers.parseEther("0.01") });
      showToast("txSent", 'info');
      await tx.wait();
      await fetchData();
      
      // Обновляем лидербоард только если это новая транзакция
      if (tx.hash !== lastTransactionHash) {
        setLastTransactionHash(tx.hash);
        // Простой лидербоард не нуждается в принудительном обновлении
      }

      if (myAddress && lastWinner && myAddress.toLowerCase() === lastWinner.toLowerCase()) {
        setStatus("Success! You smashed the pool.");
        showToast("smashSuccess", 'success');
        setTimeout(() => setShowConfetti(false), 2800);
      } else {
        setStatus("Not lucky this time. The pool is growing");
        showToast("Not lucky this time. The pool is growing", 'info');
      }
    } catch (e: any) {
      const msg = typeof e?.message === 'string' ? e.message.toLowerCase() : '';
      if (
        e?.code === 4001 ||
        msg.includes('user denied') ||
        msg.includes('user rejected')
      ) {
        setStatus("Transaction cancelled by user.");
        showToast("Transaction cancelled by user.", 'info');
      } else if (
        e?.code === 'CALL_EXCEPTION' ||
        msg.includes('missing revert data')
      ) {
        setStatus("Transaction failed. Please check the game state and your balance.");
        showToast("Transaction failed. Please check the game state and your balance.", 'error');
      } else {
        setStatus("Transaction failed.");
        showToast("smashFailed", 'error');
        console.error('Transaction error:', e);
      }
    }
    setIsActionLoading(false);
  };

  const handleSteal = async () => {
    if (!contract) return;
    setIsActionLoading(true);
    setStatus("Trying to Steal...");
    try {
      const tx = await contract.steal({ value: ethers.parseEther("0.01") });
      showToast("stealTry", 'info');
      await tx.wait();
      setStatus("Steal attempt finished!");
      showToast("stealFinished", 'success');
      await fetchData();
      
      // Обновляем лидербоард только если это новая транзакция
      if (tx.hash !== lastTransactionHash) {
        setLastTransactionHash(tx.hash);
        // Простой лидербоард не нуждается в принудительном обновлении
      }
      
      if (myAddress && lastWinner && myAddress.toLowerCase() === lastWinner.toLowerCase()) {
        setTimeout(() => setShowConfetti(false), 2800);
      }
    } catch (e: any) {
      const msg = typeof e?.message === 'string' ? e.message.toLowerCase() : '';
      if (
        e?.code === 4001 ||
        msg.includes('user denied') ||
        msg.includes('user rejected')
      ) {
        setStatus("Transaction cancelled by user.");
        showToast("Transaction cancelled by user.", 'info');
      } else {
        setStatus("Transaction failed.");
        showToast("stealFailed", 'error');
        console.error('Transaction error:', e);
      }
    }
    setIsActionLoading(false);
  };



  const handleDisconnect = () => {
    setStatus('');
    setShowConfetti(false);
    disconnectWallet();
  };

  // Мемоизируем GameInterface для предотвращения лишних рендеров
  const memoizedGameInterface = useMemo(() => (
    <GameInterface
      pool={pool}
      lastWinner={lastWinner}
      lastWinAmount={lastWinAmount}
      status={status}
      myAddress={myAddress}
      isActionLoading={isActionLoading}
      onSmash={handleSmash}
      onSteal={handleSteal}
      userBalance={userBalance}
      currentChance={currentChance}
      hallOfFame={hallOfFame}
      isFetching={isFetching}
    />
  ), [
    pool,
    lastWinner,
    lastWinAmount,
    status,
    myAddress,
    isActionLoading,
    userBalance,
    currentChance,
    hallOfFame,
    isFetching
  ]);

  return (
    <>
      <GlassGlobalStyle />

      <GlassCenter>
        <div style={{ paddingTop: '20px' }}> {/* Отступ сверху для кнопки */}
          <ResponsiveGlassCard>
          {walletConnected
            ? (!hasLoadedOnce && isInitializing)
              ? <div style={{textAlign:'center',marginTop:60,fontSize:'1.3em'}}>Loading game data...</div>
              : memoizedGameInterface
            : <StartScreen />
          }
        </ResponsiveGlassCard>
        </div> {/* Закрывающий тег для div с отступом */}
        
        {networkWarning && (
          <GlassNetworkWarning>
            {networkWarning}
          </GlassNetworkWarning>
        )}
      </GlassCenter>
      {toastMsg && <Toast type={toastMsg.type}>{toastMsg.text}</Toast>}
      <Footer />

      {/* Кнопка кошелька в правом верхнем углу */}
      {walletConnected && (
        <WalletButton onClick={() => setShowDisconnectMenu(v => !v)}>
          <span>{shortAddress(myAddress)}</span>
          <span>{userBalance !== undefined && userBalance !== null ? `${userBalance} STT` : '0 STT'}</span>
          {showDisconnectMenu && (
            <WalletDropdown>
              <button onClick={(e) => {
                e.stopPropagation();
                setShowDisconnectMenu(false);
                handleDisconnect();
              }}>
                Disconnect
              </button>
            </WalletDropdown>
          )}
        </WalletButton>
      )}

      {/* Кнопки в левом верхнем углу */}
      {walletConnected && (
        <TopLeftButtonsContainer>
          <TopLeftButton onClick={() => setShowLeaderboard(v => !v)}>
            {showLeaderboard ? 'Close' : 'Top Players'}
          </TopLeftButton>
          <TopLeftButton onClick={() => setShowHallOfFame(v => !v)}>
            {showHallOfFame ? 'Close' : 'Hall of Fame'}
          </TopLeftButton>
        </TopLeftButtonsContainer>
      )}

      {/* Отображение лидербоарда */}
      {walletConnected && hasLoadedOnce && showLeaderboard && (
        <TopLeftLeaderboard 
          contract={contract} 
          currentPlayerAddress={myAddress}
        />
      )}

      {/* Отображение Hall of Fame */}
      {walletConnected && hasLoadedOnce && showHallOfFame && (
        <TopLeftHallOfFame 
          hallOfFame={hallOfFame} 
          myAddress={myAddress}
        />
      )}
    </>
  );
};

export default App;
