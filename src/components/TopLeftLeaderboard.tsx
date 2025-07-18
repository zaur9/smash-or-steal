import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { ContractService } from '../services/contractService';
import { shortAddress } from '../utils/shortAddress';

const LeaderboardContainer = styled.div`
  position: fixed;
  top: 70px; /* Под кнопкой */
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 380px;
  z-index: 999;
  max-height: 500px;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    left: 10px;
    width: calc(100vw - 20px);
    max-width: 360px;
    padding: 16px;
  }
`;

const Title = styled.h3`
  color: #232946;
  font-family: 'Montserrat', sans-serif;
  font-size: 1.2em;
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PlayerRow = styled.div<{ isCurrentPlayer?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  margin-bottom: 6px;
  background: ${props => props.isCurrentPlayer ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 10px;
  border: ${props => props.isCurrentPlayer ? '2px solid #FFD700' : '1px solid rgba(255, 255, 255, 0.2)'};
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
`;

const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Rank = styled.div`
  font-size: 1.1em;
  font-weight: 900;
  color: #232946;
  min-width: 25px;
  text-align: center;
`;

const Address = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  color: #232946;
  font-size: 0.85em;
`;

const Stats = styled.div`
  display: flex;
  gap: 12px;
  font-size: 0.8em;
  color: #666;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
`;

const StatValue = styled.div`
  font-weight: 700;
  color: #232946;
`;

const StatLabel = styled.div`
  font-size: 0.75em;
  color: #888;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 16px;
  color: #666;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9em;
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 16px;
  color: #e74c3c;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9em;
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
  margin-bottom: 12px;
  width: 100%;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

interface TopLeftLeaderboardProps {
  contract: ethers.Contract | null;
  currentPlayerAddress?: string;
}

interface PlayerData {
  address: string;
  rank: number;
  totalTransactions: number;
  totalWins: number;
  winRate: number;
  isCurrentPlayer: boolean;
}

const TopLeftLeaderboard: React.FC<TopLeftLeaderboardProps> = ({ contract, currentPlayerAddress }) => {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadLeaderboard = useCallback(async () => {
    if (!contract || !contract.runner) {
      setError('Contract not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = new ContractService(contract.runner as ethers.Signer);
      const data = await service.getLeaderboard(10);
      
      const playerData: PlayerData[] = data.topPlayers.map((player, index) => ({
        address: player.address,
        rank: index + 1,
        totalTransactions: player.totalTransactions,
        totalWins: player.totalWins,
        winRate: player.winRate,
        isCurrentPlayer: currentPlayerAddress?.toLowerCase() === player.address.toLowerCase()
      }));
      
      setPlayers(playerData);
      setHasLoaded(true);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      setError('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  }, [contract, currentPlayerAddress]);

  // Автоматическая загрузка при открытии (убираем автозагрузку)
  useEffect(() => {
    // Загружаем только при первом рендере, если еще не загружали
    if (contract && !hasLoaded && !isLoading) {
      loadLeaderboard();
    }
  }, [contract, hasLoaded, isLoading, loadLeaderboard]);

  return (
    <LeaderboardContainer>
      <Title>Top Players by Transactions</Title>
      
      <RefreshButton onClick={loadLeaderboard} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Refresh'}
      </RefreshButton>
      
      {error && <ErrorText>{error}</ErrorText>}
      
      {isLoading && !hasLoaded && <LoadingText>Loading leaderboard...</LoadingText>}
      
      {players.length > 0 && (
        <div>
          {players.map((player) => (
            <PlayerRow key={player.address} isCurrentPlayer={player.isCurrentPlayer}>
              <PlayerInfo>
                <Rank>#{player.rank}</Rank>
                <Address>
                  {player.isCurrentPlayer ? 'You' : shortAddress(player.address)}
                </Address>
              </PlayerInfo>
              <Stats>
                <StatItem>
                  <StatValue>{player.totalTransactions}</StatValue>
                  <StatLabel>Txns</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{player.totalWins}</StatValue>
                  <StatLabel>Wins</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{player.winRate.toFixed(1)}%</StatValue>
                  <StatLabel>Rate</StatLabel>
                </StatItem>
              </Stats>
            </PlayerRow>
          ))}
        </div>
      )}
      
      {hasLoaded && players.length === 0 && !isLoading && !error && (
        <LoadingText>No players found</LoadingText>
      )}
    </LeaderboardContainer>
  );
};

export default TopLeftLeaderboard;
