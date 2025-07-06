import React, { useState, useEffect, useRef } from "react";

import { ethers } from "ethers";
import GameInterface from "./components/GameInterface";
import StartScreen from "./components/StartScreen";
import Toast from "./components/Toast";
import Footer from "./components/Footer";
import { GradientButton, ButtonText } from "./styles/StyledBlocks";
import { useGameData } from './hooks/useGameData';
import GlassGlobalStyle from './styles/GlassGlobalStyle';
import {
  GlassCard,
  GlassWallet,
  GlassNetworkWarning,
  ResponsiveGlassCard,
  GlassCenter
} from './styles/AppBlocks';
import { shortAddress } from './utils/shortAddress';
import { toastMessages, getToastMessage } from './utils/toastMessages';
import { useWallet } from './hooks/useWallet';

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
  } = useWallet(showToast);

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

  return (
    <>
      <GlassGlobalStyle />

      {myAddress && (
        <GlassWallet
          onClick={() => setShowDisconnectMenu(v => !v)}
          aria-label="Wallet menu"
          title="Wallet menu"
        >
          <span style={{ color: '#222', fontWeight: 700 }}>{shortAddress(myAddress)}</span>
          <span style={{ color: '#555', fontWeight: 400, fontSize: '0.98em' }}>{userBalance !== undefined && userBalance !== null ? `${userBalance} STT` : '0 STT'}</span>

          {showDisconnectMenu && (
            <GradientButton
              style={{ minWidth: 180, width: '98%', maxWidth: 260, zIndex: 10001 }}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                setShowDisconnectMenu(false);
                handleDisconnect();
              }}
            >
              <ButtonText style={{ color: '#e53935' }}>Disconnect</ButtonText>
            </GradientButton>
          )}
        </GlassWallet>
      )}

      <GlassCenter>
        <ResponsiveGlassCard>
          {walletConnected
            ? (!hasLoadedOnce && isInitializing)
              ? <div style={{textAlign:'center',marginTop:60,fontSize:'1.3em'}}>Loading game data...</div>
              : <GameInterface
                  pool={pool}
                  onSmash={handleSmash}
                  onSteal={handleSteal}
                  status={status}
                  lastWinner={lastWinner}
                  lastWinAmount={lastWinAmount}
                  hallOfFame={hallOfFame}
                  isActionLoading={isActionLoading}
                  isFetching={isFetching}
                  myAddress={myAddress}
                  userBalance={userBalance}
                  currentChance={currentChance}
                />
            : <StartScreen onConnect={connectWallet} />
          }
        </ResponsiveGlassCard>
        {networkWarning && (
          <GlassNetworkWarning>
            {networkWarning}
          </GlassNetworkWarning>
        )}
      </GlassCenter>
      {toastMsg && <Toast type={toastMsg.type}>{toastMsg.text}</Toast>}
      <Footer />
    </>
  );
};

export default App;
