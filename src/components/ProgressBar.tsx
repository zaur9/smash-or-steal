import React from "react";

interface ProgressBarProps {
  percent: number;
  height?: number;
  borderRadius?: number;
  gradient?: string[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percent, height = 18, borderRadius = 12 }) => {
  const fillStyle = {
    height: '100%',
    background: 'linear-gradient(90deg, #FFD700 0%, #B8C1EC 60%, #232946 100%)',
    width: percent + '%',
    borderRadius: borderRadius,
    boxShadow: '0 2px 12px #FFD70033 inset',
    transition: 'width 1.2s cubic-bezier(0.5,1,0.7,1)',
  };
  return (
    <div style={{
      background: 'rgba(255,255,255,0.18)',
      borderRadius: borderRadius,
      width: '100%',
      height: height,
      margin: '18px 0 8px 0',
      overflow: 'hidden',
      boxShadow: '0 2px 12px #FFD70033',
      border: '2px solid #FFD700',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={fillStyle} />
    </div>
  );
};
export default ProgressBar;
