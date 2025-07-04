import { useState, useEffect, useRef } from 'react';
import { ethers, JsonRpcSigner } from 'ethers';
import { ContractService } from '../services/contractService';

export function useGameData(
  contract: ethers.Contract | null,
  myAddress: string
) {
  const [pool, setPool] = useState<string>('0');
  const [lastWinner, setLastWinner] = useState<string>('');
  const [lastWinAmount, setLastWinAmount] = useState<string>('0');
  const [hallOfFame, setHallOfFame] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('');
  const [isFetching, setIsFetching] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [userBalance, setUserBalance] = useState<string>('0');
  const [baseWinPercent, setBaseWinPercent] = useState<number>(20);
  const [maxWinPercent, setMaxWinPercent] = useState<number>(50);
  const [failStreak, setFailStreak] = useState<number>(0);
  const [currentChance, setCurrentChance] = useState<number>(20);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    if (
      !contract ||
      !myAddress ||
      typeof myAddress !== 'string' ||
      !ethers.isAddress(myAddress) ||
      !contract.runner ||
      !(contract.runner instanceof JsonRpcSigner)
    ) {
      if (isInitializing) setIsInitializing(false);
      return;
    }
    try {
      if (!isInitializing) setIsFetching(true);
      const service = new ContractService(contract.runner);
      setPool(await service.getPool());
      setLastWinner(await service.getLastWinner());
      setLastWinAmount(await service.getLastWinAmount());
      setHallOfFame(await service.getHallOfFame());
      setUserBalance(await service.getUserBalance(myAddress));
      // Получаем шанс победы
      const base = await service.getBaseWinPercent();
      const max = await service.getMaxWinPercent();
      const stats = await service.getStats(myAddress);
      setBaseWinPercent(base);
      setMaxWinPercent(max);
      setFailStreak(stats.failStreak);
      setCurrentChance(Math.min(base + stats.failStreak, max));
      setStatus('');
      setHasLoadedOnce(true);
    } catch (e: any) {
      console.error('fetchData error:', e);
      if (
        e?.code === 'BAD_DATA' ||
        (typeof e?.message === 'string' && e.message.includes('could not decode result data'))
      ) {
        setStatus('');
      } else {
        setStatus('Failed to load game data. Please check your connection or try again.');
      }
    } finally {
      if (isInitializing) setIsInitializing(false);
      setIsFetching(false);
    }
    timerRef.current = setTimeout(fetchData, 12000);
  };

  useEffect(() => {
    if (contract && myAddress) {
      fetchData();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, myAddress]);

  return {
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
  };
} 
