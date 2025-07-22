import React from "react";
import { ConfettiWrap, ConfettiItem } from "../styles/StyledBlocks";

interface ConfettiItemProps {
  key: number;
  top: number;
  left: number;
  color: string;
  duration: number;
}


const StyledConfettiItem = ConfettiItem as React.ComponentType<ConfettiItemProps>;

const confettiArray: ConfettiItemProps[] = Array.from({ length: 22 }, (_, i) => ({
  key: i,
  top: Math.random() * 12 - 4,
  left: Math.random() * 97,
  color: ["#f9b700","#ff2b75","#a900ff","#00e0ff","#fff","#ffe16b"][i%6],
  duration: 1.9 + Math.random() * 1.7
}));

const Confetti: React.FC = () => (
  <ConfettiWrap>
    {confettiArray.map(item => (
      <StyledConfettiItem
        key={item.key}
        top={item.top}
        left={item.left}
        color={item.color}
        duration={item.duration}
      />
    ))}
  </ConfettiWrap>
);
export default Confetti;
