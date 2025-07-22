import React from 'react';
import styled from 'styled-components';
import { LeaderboardData } from '../types/leaderboard';
import { shortAddress } from '../utils/shortAddress';

const CompactContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 16px;
  margin: 16px 0;
  max-width: 300px;
`;

const CompactTitle = styled.h3`
  color: #232946;
  font-family: 'Montserrat', sans-serif;
  font-size: 1.1em;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const CompactRow = styled.div<{ isCurrentPlayer?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  margin-bottom: 4px;
  background: ${props => props.isCurrentPlayer ? 'rgba(255, 215, 0, 0.15)' : 'transparent'};
  border-radius: 8px;
  border: ${props => props.isCurrentPlayer ? '1px solid rgba(255, 215, 0, 0.3)' : 'none'};
  font-size: 0.85em;
`;

const CompactPlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #232946;
  font-weight: 500;
`;

const CompactRank = styled.span`
  font-weight: 700;
  min-width: 20px;
  text-align: center;
`;

const CompactStats = styled.div`
  color: #666;
  font-size: 0.9em;
  font-weight: 600;
`;

const ViewAllButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #00ffff;
  border-radius: 8px;
  color: #00ffff;
  padding: 8px 12px;
  font-size: 0.8em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  text-shadow: 0 0 10px #00ffff;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
  
  &:hover {
    background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
    border-color: #ff00ff;
    color: #ff00ff;
    text-shadow: 0 0 15px #ff00ff;
    box-shadow: 0 0 25px rgba(255, 0, 255, 0.4);
    transform: translateY(-1px);
  }
`;

interface CompactLeaderboardProps {
  data: LeaderboardData;
  currentPlayerAddress?: string;
  onViewAll?: () => void;
}

const CompactLeaderboard: React.FC<CompactLeaderboardProps> = ({ 
  data, 
  currentPlayerAddress, 
  onViewAll 
}) => {
  const topThree = data.topPlayers.slice(0, 3);

  return (
    <CompactContainer>
      <CompactTitle>
        🏆 Top Transactions
      </CompactTitle>
      
      {topThree.map((player) => (
        <CompactRow 
          key={player.address}
          isCurrentPlayer={currentPlayerAddress?.toLowerCase() === player.address.toLowerCase()}
        >
          <CompactPlayerInfo>
            <CompactRank>#{player.rank}</CompactRank>
            <span>{shortAddress(player.address)}</span>
          </CompactPlayerInfo>
          <CompactStats>
            {player.totalTransactions} tx
          </CompactStats>
        </CompactRow>
      ))}
      
      {data.currentPlayerStats && 
       !topThree.find(p => p.address.toLowerCase() === currentPlayerAddress?.toLowerCase()) && (
        <CompactRow isCurrentPlayer={true}>
          <CompactPlayerInfo>
            <CompactRank>#{data.currentPlayerRank}</CompactRank>
            <span>You</span>
          </CompactPlayerInfo>
          <CompactStats>
            {data.currentPlayerStats.totalTransactions} tx
          </CompactStats>
        </CompactRow>
      )}
      
      {onViewAll && (
        <ViewAllButton onClick={onViewAll}>
          View Full Leaderboard
        </ViewAllButton>
      )}
    </CompactContainer>
  );
};

export default CompactLeaderboard;
