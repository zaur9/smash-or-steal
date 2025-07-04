import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contract';

export function useWallet(showToast: (msg: string, type?: 'success' | 'error' | 'info') => void) {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [myAddress, setMyAddress] = useState<string>("");
  const [networkWarning, setNetworkWarning] = useState<string | null>(null);
  const REQUIRED_CHAIN_ID = 50312; // Somnia Testnet

  const connectWallet = useCallback(async () => {
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
      showToast('walletFailed', 'error');
      setWalletConnected(false);
      setSigner(null);
    }
  }, [showToast]);

  const disconnectWallet = useCallback(() => {
    setWalletConnected(false);
    setSigner(null);
    setContract(null);
    setMyAddress('');
    setNetworkWarning('');
    showToast('Disconnected', 'info');
  }, [showToast]);

  return {
    signer,
    contract,
    walletConnected,
    myAddress,
    networkWarning,
    connectWallet,
    disconnectWallet,
    setNetworkWarning,
    setWalletConnected,
    setSigner,
    setContract,
    setMyAddress
  };
}
