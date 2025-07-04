import React from 'react';

interface HallOfFameProps {
  hallOfFame: string[];
  myAddress?: string;
}

function shortAddress(addr: string) {
  if (!addr) return '';
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}

const HallOfFame: React.FC<HallOfFameProps> = ({ hallOfFame, myAddress }) => {
  return (
    <div style={{
      margin: '12px 0',
      padding: 12,
      background: 'rgba(255,255,255,0.18)',
      borderRadius: 20,
      boxShadow: '0 2px 12px #FFD70033',
      border: '2px solid #FFD700',
      height: '100%',
      overflowY: 'auto',
      backdropFilter: 'blur(8px)',
    }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}
      >

        <span
          style={{
            fontWeight: 700,
            fontSize: '1.10em',
            color: '#232946',
            background: 'none',
            letterSpacing: '.03em',
            userSelect: 'none',
            textShadow: '0 2px 8px #fff3, 0 1px 0 #23294633',
          }}
        >
          Hall of Fame
        </span>
      </div>
      {(!hallOfFame || hallOfFame.length === 0) ? (
        <div style={{textAlign:'center', color:'#232946', fontStyle:'italic', fontWeight:500, fontSize:'1.05em', marginTop:12}}>
          Be the first to win
        </div>
      ) : (
        <ol style={{ paddingLeft: 18, margin: 0 }}>
          {hallOfFame.map((address, idx) => (
            <li key={address + idx} style={{
              color: '#18122B',
              fontWeight: 700,
              fontSize: idx === 0 ? '1.13em' : '1em',
              wordBreak: 'break-all',
              marginBottom: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              textShadow: '0 2px 8px #fff3, 0 1px 0 #23294633',
            }}>
              {idx === 0 && <span style={{fontSize:'1.1em', color:'#232946'}}>🥇</span>}
              {shortAddress(address)}
              {myAddress && address.toLowerCase() === myAddress.toLowerCase() && <span style={{fontSize:'0.95em', color:'#232946', marginLeft:2}}>(You)</span>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default HallOfFame; 