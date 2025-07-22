import { useAccount, useConnect, useDisconnect, useWalletClient } from 'wagmi';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contract';

export function useWallet(showToast: (_msg: string, _type?: 'success' | 'error' | 'info') => void) {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();
  
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [networkWarning, setNetworkWarning] = useState<string | null>(null);
  
  const REQUIRED_CHAIN_ID = 50312; // Somnia Testnet

  // Проверка сети и создание контракта
  useEffect(() => {
    if (isConnected && walletClient) {
      // Проверяем сеть
      if (chainId !== REQUIRED_CHAIN_ID) {
        setNetworkWarning('Please switch to Somnia Testnet in your wallet.');
        showToast('You are not on the required Somnia Testnet!', 'error');
        setContract(null);
        setSigner(null);
        return;
      } else {
        setNetworkWarning(null);
      }

      // Создаем провайдер и signer
      const provider = new ethers.BrowserProvider(walletClient);
      
      provider.getSigner().then(signerInstance => {
        setSigner(signerInstance);
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerInstance);
        setContract(contractInstance);
      }).catch(error => {
        console.error('Error creating signer:', error);
        showToast('Failed to create wallet connection', 'error');
      });
    } else {
      setContract(null);
      setSigner(null);
      setNetworkWarning(null);
    }
  }, [isConnected, walletClient, chainId, showToast]);

  // Функция подключения кошелька (теперь показывает модальное окно RainbowKit)
  const connectWallet = async () => {
    try {
      if (connectors.length > 0) {
        // Подключаемся к первому доступному коннектору
        // RainbowKit автоматически покажет модальное окно выбора кошелька
        connect({ connector: connectors[0] });
      } else {
        showToast('No wallet connectors available', 'error');
      }
    } catch (error) {
      console.error('Connection error:', error);
      showToast('Failed to connect wallet', 'error');
    }
  };

  // Функция отключения кошелька
  const disconnectWallet = () => {
    disconnect();
    setContract(null);
    setSigner(null);
    setNetworkWarning(null);
    showToast('Wallet disconnected', 'info');
  };

  return {
    // Данные кошелька
    walletConnected: isConnected,
    myAddress: address || '',
    chainId,
    
    // Контракт и подписант
    contract,
    signer,
    
    // Функции управления
    connectWallet,
    disconnectWallet,
    
    // Состояние сети
    networkWarning,
    setNetworkWarning,
    
    // Дополнительные функции для обратной совместимости
    setWalletConnected: () => {}, // Не используется с Wagmi
    setSigner: () => {}, // Не используется с Wagmi
    setContract: () => {}, // Не используется с Wagmi
    setMyAddress: () => {}, // Не используется с Wagmi
  };
}
