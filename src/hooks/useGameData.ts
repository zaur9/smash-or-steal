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
  const lastFetchRef = useRef<number>(0);
  const cacheTimeoutMs = 30000; // Увеличиваем кэш до 30 секунд

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

    // Проверяем кэш - если данные свежие, не делаем запрос
    const now = Date.now();
    if (hasLoadedOnce && (now - lastFetchRef.current) < cacheTimeoutMs) {
      // Данные еще свежие, перезапускаем таймер с большим интервалом
      timerRef.current = setTimeout(fetchData, 60000); // Увеличиваем до 60 секунд
      return;
    }

    try {
      if (!isInitializing) setIsFetching(true);
      const service = new ContractService(contract.runner);
      
      // Выполняем запросы батчами для оптимизации
      const [poolData, winnerData, winAmountData] = await Promise.all([
        service.getPool(),
        service.getLastWinner(),
        service.getLastWinAmount()
      ]);
      
      const [hallOfFameData, balanceData] = await Promise.all([
        service.getHallOfFame(),
        service.getUserBalance(myAddress)
      ]);
      
      const [basePercent, maxPercent, userStats] = await Promise.all([
        service.getBaseWinPercent(),
        service.getMaxWinPercent(),
        service.getStats(myAddress)
      ]);

      // Обновляем состояние одной операцией
      setPool(poolData);
      setLastWinner(winnerData);
      setLastWinAmount(winAmountData);
      setHallOfFame(hallOfFameData);
      setUserBalance(balanceData);
      setBaseWinPercent(basePercent);
      setMaxWinPercent(maxPercent);
      setFailStreak(userStats.failStreak);
      setCurrentChance(Math.min(basePercent + userStats.failStreak, maxPercent));
      setStatus('');
      setHasLoadedOnce(true);
      
      // Обновляем время последнего фетча
      lastFetchRef.current = now;
    } catch (e: unknown) {
      console.error('fetchData error:', e);
      const error = e as { code?: string; message?: string };
      if (
        error?.code === 'BAD_DATA' ||
        (typeof error?.message === 'string' && error.message.includes('could not decode result data'))
      ) {
        setStatus('');
      } else {
        setStatus('Failed to load game data. Please check your connection or try again.');
      }
    } finally {
      if (isInitializing) setIsInitializing(false);
      setIsFetching(false);
    }
    // Увеличиваем интервал до 60 секунд для снижения нагрузки
    timerRef.current = setTimeout(fetchData, 60000);
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
