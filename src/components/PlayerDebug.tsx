import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { ContractService } from '../services/contractService';
import { shortAddress } from '../utils/shortAddress';

const DebugContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  font-family: 'Courier New', monospace;
  font-size: 0.85em;
  color: #232946;
  max-width: 600px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const DebugTitle = styled.h3`
  margin: 0 0 12px 0;
  color: #232946;
  font-size: 1em;
`;

const DebugButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  margin: 4px;
  font-size: 0.8em;
  
  &:hover {
    background: #0056b3;
  }
`;

interface PlayerDebugProps {
  contract: ethers.Contract | null;
  currentPlayerAddress?: string;
}

const PlayerDebug: React.FC<PlayerDebugProps> = ({ contract, currentPlayerAddress }) => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPlayerStats = async (address: string) => {
    if (!contract || !contract.runner) return;
    
    setIsLoading(true);
    try {
      const service = new ContractService(contract.runner as ethers.Signer);
      const stats = await service.getStats(address);
      const transactionCount = await service.getPlayerTransactionCount(address);
      
      setDebugInfo({
        address,
        stats,
        transactionCount,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Debug error:', error);
      setDebugInfo({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHallOfFame = async () => {
    if (!contract || !contract.runner) return;
    
    setIsLoading(true);
    try {
      const service = new ContractService(contract.runner as ethers.Signer);
      const hallOfFame = await service.getHallOfFame();
      
      setDebugInfo({
        type: 'hallOfFame',
        hallOfFame,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Debug error:', error);
      setDebugInfo({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DebugContainer>
      <DebugTitle>🔍 Player Stats Debug</DebugTitle>
      
      <div>
        <DebugButton onClick={() => currentPlayerAddress && fetchPlayerStats(currentPlayerAddress)}>
          Get My Stats
        </DebugButton>
        <DebugButton onClick={fetchHallOfFame}>
          Get Hall of Fame
        </DebugButton>
      </div>

      {isLoading && <div>Loading...</div>}
      
      {debugInfo && (
        <pre style={{ 
          background: 'rgba(0,0,0,0.1)', 
          padding: '12px', 
          borderRadius: '8px',
          marginTop: '12px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all'
        }}>
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      )}
    </DebugContainer>
  );
};

export default PlayerDebug;
