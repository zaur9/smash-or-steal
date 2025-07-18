import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { ContractService } from '../services/contractService';
import { LeaderboardData } from '../types/leaderboard';

export function useLeaderboard(contract: ethers.Contract | null, currentPlayerAddress?: string) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData>({ topPlayers: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    if (!contract || !contract.runner) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const service = new ContractService(contract.runner as ethers.Signer);
      const data = await service.getLeaderboard(10);
      
      // Если есть текущий игрок, получаем его рейтинг
      if (currentPlayerAddress) {
        const playerRank = await service.getPlayerRank(currentPlayerAddress);
        if (playerRank) {
          data.currentPlayerRank = playerRank.rank;
          data.currentPlayerStats = playerRank.stats;
        }
      }
      
      setLeaderboardData(data);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  }, [contract, currentPlayerAddress]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    leaderboardData,
    isLoading,
    error,
    refetch: fetchLeaderboard
  };
}
