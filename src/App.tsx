import React, { useState, useEffect, useMemo, useRef } from "react";
import GlobalStyle from "./styles/GlobalStyle";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./utils/contract";
import { ethers } from "ethers";
import GameInterface from "./components/GameInterface";
import StartScreen from "./components/StartScreen";
import Toast from "./components/Toast";
import Footer from "./components/Footer";
import { WalletButtonContainer, GradientButton, ButtonText } from "./styles/StyledBlocks";
import { useGameData } from './utils/useGameData';
import styled, { createGlobalStyle } from 'styled-components';

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

// Функция для сокращения адреса
function shortAddress(addr: string) {
  if (!addr) return '';
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}

const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.28);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  backdrop-filter: blur(12px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  padding: 48px 36px 36px 36px;
  margin: 0 auto;
  max-width: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GlassWallet = styled.div`
  position: fixed;
  top: 18px;
  right: 24px;
  background: rgba(255,255,255,0.85);
  box-shadow: 0 4px 24px 0 rgba(31, 38, 135, 0.18);
  border-radius: 14px;
  padding: 10px 20px;
  color: #222;
  font-weight: 700;
  font-size: 1em;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 0;
  max-width: 220px;
  word-break: break-all;
  cursor: pointer;
  transition: box-shadow 0.2s, background 0.2s;
`;

const GlassNetworkWarning = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(90deg, #fbc2eb 0%, #a18cd1 100%);
  color: #222;
  text-align: center;
  padding: 14px 0;
  font-weight: 700;
  font-size: 1.1em;
  z-index: 9999;
  box-shadow: 0 2px 12px #a18cd122;
`;

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

const ResponsiveGlassCard = styled(GlassCard)`
  @media (max-width: 600px) {
    max-width: 98vw;
    padding: 18px 4vw 18px 4vw;
  }
`;

const GlassCenter = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
`;

const App: React.FC = () => {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [myAddress, setMyAddress] = useState<string>("");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [networkWarning, setNetworkWarning] = useState<string | null>(null);
  const REQUIRED_CHAIN_ID = 50312; // Somnia Testnet
  const [showDisconnectMenu, setShowDisconnectMenu] = useState(false);
  const disconnectMenuRef = useRef<HTMLDivElement | null>(null);

  const toastMessages = useMemo(() => ({
    installMetaMask: "Please install MetaMask!",
    walletConnected: "Wallet connected!",
    walletFailed: "Wallet connection failed or was rejected.",
    txSent: "Transaction sent! Waiting...",
    smashSuccess: "SMASH! Success",
    smashFailed: "Smash failed",
    stealTry: "Trying to Steal...",
    stealFinished: "Steal finished",
    stealFailed: "Steal failed"
  }), []);

  const showToast = (msgKey: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMsg({ text: toastMessages[msgKey as keyof typeof toastMessages] || msgKey, type });
    setTimeout(() => setToastMsg(null), 10000);
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum || typeof window.ethereum.request !== 'function') {
        showToast("installMetaMask", 'error');
        return;
      }
      const prov = new ethers.BrowserProvider(window.ethereum);
      const network = await prov.getNetwork();
      if (Number(network.chainId) !== REQUIRED_CHAIN_ID) {
        setNetworkWarning('Please switch to Somnia Testnet in MetaMask.');
        showToast('You are not on the required Somnia Testnet!', 'error');
        setWalletConnected(false);
        setSigner(null);
        setContract(null);
        return;
      } else {
        setNetworkWarning(null);
      }
      const signerInstance = await prov.getSigner();
      const address = await signerInstance.getAddress();
      setSigner(signerInstance);
      setMyAddress(address);
      setWalletConnected(true);
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerInstance);
      setContract(contractInstance);
      showToast("walletConnected", 'success');
    } catch (e) {
      console.error('connectWallet error:', e);
      showToast('walletFailed', 'error');
      setWalletConnected(false);
      setSigner(null);
    }
  };

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
    setHasLoadedOnce,
    setIsInitializing,
    fetchData,
    userBalance,
    baseWinPercent,
    maxWinPercent,
    failStreak,
    currentChance,
  } = useGameData(contract, setShowConfetti, myAddress);

  useEffect(() => {
    if (window.ethereum && !walletConnected) {
      setWalletConnected(false);
    }
    if (contract) {
      fetchData();
    }
    if (window.ethereum && typeof window.ethereum.on === 'function') {
      const handleChainChanged = (...args: unknown[]) => {
        const chainIdHex = typeof args[0] === 'string' ? args[0] : '';
        setWalletConnected(false);
        setSigner(null);
        setContract(null);
        setMyAddress('');
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
    // eslint-disable-next-line
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
      const prevWinner = lastWinner;
      const tx = await contract.smash({ value: ethers.parseEther("0.01") });
      showToast("txSent", 'info');
      await tx.wait();
      await fetchData();
      // Проверяем, стал ли пользователь победителем
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

  // Функция для дисконнекта
  const handleDisconnect = () => {
    setWalletConnected(false);
    setSigner(null);
    setContract(null);
    setMyAddress('');
    setStatus('');
    setShowConfetti(false);
    setNetworkWarning('');
    showToast('Disconnected', 'info');
  };

  return (
    <>
      <GlassGlobalStyle />
      <GlobalStyle />
      {/* Wallet info in top right of the whole page */}
      {myAddress && (
        <GlassWallet
          onClick={() => setShowDisconnectMenu(v => !v)}
          aria-label="Wallet menu"
          title="Wallet menu"
        >
          <span style={{ color: '#222', fontWeight: 700 }}>{shortAddress(myAddress)}</span>
          <span style={{ color: '#555', fontWeight: 400, fontSize: '0.98em' }}>{Number(userBalance).toFixed(3)} STT</span>
          {showDisconnectMenu && (
            <GradientButton
              style={{ minWidth: 180, width: '98%', maxWidth: 260, zIndex: 10001 }}
              onClick={e => {
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
      {!walletConnected && false /* убираем WalletButtonContainer для StartScreen, кнопка теперь только внутри карточки */}
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
