export const CONTRACT_ADDRESS: string = "0x58C73e52Ed763FFF530eDB121E8da1886d484e5d";

export const CONTRACT_ABI: string[] = [
  "function pool() view returns (uint256)",
  "function steal() payable",
  "function smash() payable",
  "function lastWinner() view returns (address)",
  "function lastWinAmount() view returns (uint256)",
  "function getHallOfFame() view returns (address[])",
  "function baseWinPercent() view returns (uint256)",
  "function maxWinPercent() view returns (uint256)",
  "function getStats(address) view returns (uint256 numWins, uint256 totalWins, uint256 failStreak)",
  // События из контракта
  "event Smashed(address indexed user, uint256 amount, uint256 newPool)",
  "event StealAttempt(address indexed user, uint256 amount, bool success, uint256 pool, uint256 chance)",
  "event Winner(address indexed user, uint256 amount, uint256 blockNumber)"
]; 