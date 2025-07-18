import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { ContractService } from '../services/contractService';
import { PlayerStats, LeaderboardData } from '../types/leaderboard';
import { shortAddress } from '../utils/shortAddress';

const LeaderboardContainer = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 24px;
  margin: 20px 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 16px;
    margin: 16px 0;
  }
`;

const Title = styled.h2`
  color: #232946;
  font-family: 'Montserrat', sans-serif;
  font-size: 1.5em;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PlayerRow = styled.div<{ isCurrentPlayer?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: ${props => props.isCurrentPlayer ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  border: ${props => props.isCurrentPlayer ? '2px solid #FFD700' : '1px solid rgba(255, 255, 255, 0.2)'};
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
`;

const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Rank = styled.div`
  font-size: 1.2em;
  font-weight: 900;
  color: #232946;
  min-width: 30px;
  text-align: center;
`;

const Address = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  color: #232946;
  font-size: 0.9em;
`;

const Stats = styled.div`
  display: flex;
  gap: 20px;
  font-size: 0.85em;
  color: #666;
  
  @media (max-width: 768px) {
    gap: 12px;
    justify-content: center;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const StatValue = styled.div`
  font-weight: 700;
  color: #232946;
`;

const StatLabel = styled.div`
  font-size: 0.8em;
  color: #888;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: #232946;
  font-family: 'Montserrat', sans-serif;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-family: 'Montserrat', sans-serif;
`;

const RefreshButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 8px 16px;
  font-size: 0.8em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 16px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

interface LeaderboardProps {
  contract: ethers.Contract | null;
  currentPlayerAddress?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ contract, currentPlayerAddress }) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData>({ topPlayers: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Мемоизируем функцию получения данных
  const fetchLeaderboard = useCallback(async () => {
    if (!contract || !contract.runner) {
      setIsLoading(false);
      return;
    }

    try {
      setIsRefreshing(true);
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
      setIsRefreshing(false);
    }
  }, [contract, currentPlayerAddress]);

  // Загружаем данные только один раз при монтировании
  useEffect(() => {
    fetchLeaderboard();
  }, []); // Убираем зависимости, чтобы не было лишних запросов

  // Функция для ручного обновления
  const handleRefresh = useCallback(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  if (isLoading) {
    return (
      <LeaderboardContainer>
        <Title>🏆 Transaction Leaderboard</Title>
        <LoadingSpinner>Loading leaderboard...</LoadingSpinner>
      </LeaderboardContainer>
    );
  }

  if (error) {
    return (
      <LeaderboardContainer>
        <Title>🏆 Transaction Leaderboard</Title>
        <EmptyState>
          <div>{error}</div>
          <RefreshButton onClick={handleRefresh}>Retry</RefreshButton>
        </EmptyState>
      </LeaderboardContainer>
    );
  }

  if (leaderboardData.topPlayers.length === 0) {
    return (
      <LeaderboardContainer>
        <Title>🏆 Transaction Leaderboard</Title>
        <EmptyState>
          <div>No players found yet</div>
          <RefreshButton onClick={handleRefresh}>Refresh</RefreshButton>
        </EmptyState>
      </LeaderboardContainer>
    );
  }

  return (
    <LeaderboardContainer>
      <Title>🏆 Transaction Leaderboard</Title>
      <RefreshButton onClick={handleRefresh} disabled={isRefreshing}>
        {isRefreshing ? 'Refreshing...' : 'Refresh'}
      </RefreshButton>
      
      {leaderboardData.topPlayers.map((player) => (
        <PlayerRow 
          key={player.address}
          isCurrentPlayer={currentPlayerAddress?.toLowerCase() === player.address.toLowerCase()}
        >
          <PlayerInfo>
            <Rank>#{player.rank}</Rank>
            <Address>{shortAddress(player.address)}</Address>
          </PlayerInfo>
          <Stats>
            <StatItem>
              <StatValue>{player.totalTransactions}</StatValue>
              <StatLabel>Transactions</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{player.totalWins}</StatValue>
              <StatLabel>Wins</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{player.winRate.toFixed(1)}%</StatValue>
              <StatLabel>Win Rate</StatLabel>
            </StatItem>
          </Stats>
        </PlayerRow>
      ))}
      
      {leaderboardData.currentPlayerStats && 
       !leaderboardData.topPlayers.find(p => p.address.toLowerCase() === currentPlayerAddress?.toLowerCase()) && (
        <>
          <div style={{ 
            textAlign: 'center', 
            margin: '20px 0', 
            color: '#666',
            fontSize: '0.9em'
          }}>
            ...
          </div>
          <PlayerRow isCurrentPlayer={true}>
            <PlayerInfo>
              <Rank>#{leaderboardData.currentPlayerRank}</Rank>
              <Address>You</Address>
            </PlayerInfo>
            <Stats>
              <StatItem>
                <StatValue>{leaderboardData.currentPlayerStats.totalTransactions}</StatValue>
                <StatLabel>Transactions</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{leaderboardData.currentPlayerStats.totalWins}</StatValue>
                <StatLabel>Wins</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{leaderboardData.currentPlayerStats.winRate.toFixed(1)}%</StatValue>
                <StatLabel>Win Rate</StatLabel>
              </StatItem>
            </Stats>
          </PlayerRow>
        </>
      )}
    </LeaderboardContainer>
  );
};

export default React.memo(Leaderboard);
