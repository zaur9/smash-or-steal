import React from 'react';
import styled from 'styled-components';

interface HallOfFameProps {
  hallOfFame: string[];
  myAddress?: string;
}

const Container = styled.div`
  margin: 0;
  padding: 0;
  background: transparent;
  border-radius: 0;
  border: none;
  height: 100%;
  overflow-y: auto;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #00ffff;
  font-style: italic;
  font-weight: 500;
  font-size: 1.1em;
  margin-top: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const PlayerList = styled.ol`
  padding-left: 0;
  margin: 0;
  list-style: none;
  counter-reset: rank;
`;

const PlayerItem = styled.li<{ isFirst: boolean; isMe: boolean }>`
  color: ${props => props.isMe ? '#ff00ff' : '#00ffff'};
  font-weight: 700;
  font-size: ${props => props.isFirst ? '1.2em' : '1em'};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  word-break: break-all;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: transparent;
  border: 1px solid ${props => props.isFirst ? '#ffd700' : 'rgba(0, 255, 255, 0.3)'};
  border-radius: 6px;
  position: relative;
  transition: all 0.2s ease;
  counter-increment: rank;
  
  &::before {
    content: counter(rank);
    color: ${props => props.isFirst ? '#ffd700' : '#00ffff'};
    font-weight: 900;
    font-size: 0.9em;
    min-width: 20px;
    text-align: center;
  }
  
  &:hover {
    background: rgba(0, 255, 255, 0.1);
  }
`;

const Crown = styled.span`
  font-size: 1.2em;
`;

const YouLabel = styled.span`
  font-size: 0.9em;
  color: #ff00ff;
  margin-left: 4px;
  font-weight: 600;
`;

function shortAddress(addr: string) {
  if (!addr) return '';
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}

const HallOfFame: React.FC<HallOfFameProps> = ({ hallOfFame, myAddress }) => {
  return (
    <Container>
      {(!hallOfFame || hallOfFame.length === 0) ? (
        <EmptyMessage>
          Be the first to win
        </EmptyMessage>
      ) : (
        <PlayerList>
          {hallOfFame.map((address, idx) => (
            <PlayerItem 
              key={address + idx} 
              isFirst={idx === 0}
              isMe={myAddress ? address.toLowerCase() === myAddress.toLowerCase() : false}
            >
              {idx === 0 && <Crown>👑</Crown>}
              <span>{shortAddress(address)}</span>
              {myAddress && address.toLowerCase() === myAddress.toLowerCase() && 
                <YouLabel>(You)</YouLabel>
              }
            </PlayerItem>
          ))}
        </PlayerList>
      )}
    </Container>
  );
};

export default HallOfFame; 