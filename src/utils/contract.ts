export const CONTRACT_ADDRESS: string = "0x58C73e52Ed763FFF530eDB121E8da1886d484e5d";

export const CONTRACT_ABI: string[] = [
  "function pool() view returns (uint256)",
  "function steal() payable",
  "function lastWinner() view returns (address)",
  "function lastWinAmount() view returns (uint256)",
  "function getHallOfFame() view returns (address[])",
  "function baseWinPercent() view returns (uint256)",
  "function maxWinPercent() view returns (uint256)",
  "function getStats(address) view returns (uint256 numWins, uint256 totalWins, uint256 failStreak)",
  // Добавляем возможные события контракта
  "event StealAttempt(address indexed player, bool success, uint256 amount)",
  "event Win(address indexed winner, uint256 amount)"
]; 