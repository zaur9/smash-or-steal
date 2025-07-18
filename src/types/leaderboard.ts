export interface PlayerStats {
  address: string;
  totalTransactions: number;
  totalWins: number;
  totalWinAmount: string;
  winRate: number;
  rank: number;
}

export interface LeaderboardData {
  topPlayers: PlayerStats[];
  currentPlayerRank?: number;
  currentPlayerStats?: PlayerStats;
}
