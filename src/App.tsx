import React, { useState, useEffect, useRef } from "react";

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
  GlassCenter
} from './styles/AppBlocks';
import { shortAddress } from './utils/shortAddress';
import { getToastMessage } from './utils/toastMessages';
import { useWallet } from './hooks/useWallet';
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
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #00ffff;
  border-radius: 8px;
  color: #00ffff;
  padding: 12px 16px;
  font-size: 0.85em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 0 10px #00ffff;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  
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
declare global {
  interface Window {
    ethereum?: unknown;
  }
}



const App: React.FC = () => {
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
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
    disconnectWallet,
    setNetworkWarning
  } = useWallet(showToast);

  const {
    pool,
    lastWinner,
    hallOfFame,
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

    }, [contract, fetchData, setStatus, setNetworkWarning]);

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
        // Winner animation could be handled here
      }
    } catch (e: unknown) {
      const errorObj = e as { code?: number; message?: string };
      const msg = typeof errorObj?.message === 'string' ? errorObj.message.toLowerCase() : '';
      if (
        errorObj?.code === 4001 ||
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
    disconnectWallet();
  };

  return (
    <>
      <GlassGlobalStyle />

      <GlassCenter>
        <div style={{ paddingTop: '20px' }}> {/* Отступ сверху для кнопки */}
          {walletConnected
            ? (!hasLoadedOnce && isInitializing)
              ? <div style={{textAlign:'center',marginTop:60,fontSize:'1.3em'}}>Loading game data...</div>
              : <GameInterface
                  pool={pool}
                  lastWinner={lastWinner}
                  isActionLoading={isActionLoading}
                  onSteal={handleSteal}
                  currentChance={currentChance}
                />
            : <StartScreen />
          }
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
          <TopLeftButton onClick={() => {
            setShowLeaderboard(v => !v);
            if (!showLeaderboard) setShowHallOfFame(false); // Закрыть Hall of Fame при открытии Leaderboard
          }}>
            {showLeaderboard ? 'Close' : 'Top Transactions'}
          </TopLeftButton>
          <TopLeftButton onClick={() => {
            setShowHallOfFame(v => !v);
            if (!showHallOfFame) setShowLeaderboard(false); // Закрыть Leaderboard при открытии Hall of Fame
          }}>
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
