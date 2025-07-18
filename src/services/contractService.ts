import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contract';
import { PlayerStats, LeaderboardData } from '../types/leaderboard';

export class ContractService {
  contract: ethers.Contract;
  provider: ethers.BrowserProvider;
  signer: ethers.Signer;

  constructor(signer: ethers.Signer) {
    this.signer = signer;
    this.provider = signer.provider as ethers.BrowserProvider;
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }

  async getPool(): Promise<string> {
    const p = await this.contract.pool();
    return ethers.formatEther(p);
  }

  async getLastWinner(): Promise<string> {
    return await this.contract.lastWinner();
  }

  async getLastWinAmount(): Promise<string> {
    const lwa = await this.contract.lastWinAmount();
    return ethers.formatEther(lwa);
  }

  async getHallOfFame(): Promise<string[]> {
    const hof = await this.contract.getHallOfFame();
    return Array.from(hof).slice(-10).reverse() as string[];
  }

  async smash(): Promise<ethers.TransactionResponse> {
    return await this.contract.smash({ value: ethers.parseEther('0.01') });
  }

  async steal(): Promise<ethers.TransactionResponse> {
    return await this.contract.steal({ value: ethers.parseEther('0.01') });
  }

  async getUserBalance(address: string): Promise<string> {
    const balance = await this.provider.getBalance(address);
    const value = Number(ethers.formatEther(balance));
    return value === 0 ? '0' : value.toFixed(4).replace(/\.0+$/, '');
  }

  async getBaseWinPercent(): Promise<number> {
    return Number(await this.contract.baseWinPercent());
  }

  async getMaxWinPercent(): Promise<number> {
    return Number(await this.contract.maxWinPercent());
  }

  async getStats(address: string): Promise<{ numWins: number; totalWins: number; failStreak: number }> {
    const [numWins, totalWins, failStreak] = await this.contract.getStats(address);
    return {
      numWins: Number(numWins),
      totalWins: Number(totalWins),
      failStreak: Number(failStreak),
    };
  }

  async getSTTBalance(address: string): Promise<string> {
    return '0';
  }

  // Метод для получения всех транзакций игрока
  async getPlayerTransactionCount(address: string): Promise<number> {
    try {
      // Сначала пробуем получить статистику из контракта
      const stats = await this.getStats(address);
      
      // Пробуем получить события, если они доступны
      try {
        const currentBlock = await this.provider.getBlockNumber();
        const fromBlock = Math.max(0, currentBlock - 50000); // Последние ~50k блоков
        
        // Создаем фильтры для событий
        const smashFilter = this.contract.filters.SmashAttempt?.(address);
        const stealFilter = this.contract.filters.StealAttempt?.(address);
        
        let totalEvents = 0;
        
        if (smashFilter) {
          try {
            const smashEvents = await this.contract.queryFilter(smashFilter, fromBlock, currentBlock);
            totalEvents += smashEvents.length;
          } catch (e) {
            console.log('SmashAttempt events not available');
          }
        }
        
        if (stealFilter) {
          try {
            const stealEvents = await this.contract.queryFilter(stealFilter, fromBlock, currentBlock);
            totalEvents += stealEvents.length;
          } catch (e) {
            console.log('StealAttempt events not available');
          }
        }
        
        // Если удалось получить события, используем их
        if (totalEvents > 0) {
          return totalEvents;
        }
      } catch (eventError) {
        console.log('Events not available, using stats approximation');
      }
      
      // Если события недоступны, используем статистику
      // numWins + failStreak дает приблизительное количество транзакций
      const approximateTransactions = stats.numWins + stats.failStreak;
      
      console.log(`Player ${address} stats:`, {
        numWins: stats.numWins,
        failStreak: stats.failStreak,
        totalWins: stats.totalWins,
        approximateTransactions
      });
      
      return approximateTransactions;
    } catch (error) {
      console.error('Error getting transaction count:', error);
      return 0;
    }
  }

  // Метод для получения топ игроков по транзакциям
  async getLeaderboard(limit: number = 10): Promise<LeaderboardData> {
    try {
      const hallOfFame = await this.getHallOfFame();
      const playerStats: PlayerStats[] = [];
      
      // Получаем уникальные адреса из Hall of Fame
      const uniqueAddresses = [...new Set(hallOfFame)];
      
      // Добавляем также текущего игрока если он не в Hall of Fame
      const currentSigner = await this.signer.getAddress();
      if (!uniqueAddresses.includes(currentSigner)) {
        uniqueAddresses.push(currentSigner);
      }
      
      // Получаем статистику для каждого игрока
      for (const address of uniqueAddresses) {
        try {
          const stats = await this.getStats(address);
          const transactionCount = await this.getPlayerTransactionCount(address);
          
          // Показываем игрока если у него есть хотя бы одна транзакция
          if (transactionCount > 0 || stats.numWins > 0) {
            const winRate = transactionCount > 0 ? (stats.numWins / transactionCount) * 100 : 0;
            
            playerStats.push({
              address,
              totalTransactions: transactionCount,
              totalWins: stats.numWins,
              totalWinAmount: stats.totalWins.toString(),
              winRate,
              rank: 0 // Будет установлен после сортировки
            });
          }
        } catch (error) {
          console.error(`Error getting stats for ${address}:`, error);
        }
      }
      
      // Сортируем по количеству транзакций (по убыванию)
      playerStats.sort((a, b) => {
        if (b.totalTransactions !== a.totalTransactions) {
          return b.totalTransactions - a.totalTransactions;
        }
        // Если количество транзакций одинаковое, сортируем по количеству выигрышей
        return b.totalWins - a.totalWins;
      });
      
      // Устанавливаем ранки
      playerStats.forEach((player, index) => {
        player.rank = index + 1;
      });
      
      console.log('Leaderboard data:', playerStats); // Для отладки
      
      return {
        topPlayers: playerStats.slice(0, limit)
      };
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return { topPlayers: [] };
    }
  }

  // Метод для получения рейтинга конкретного игрока
  async getPlayerRank(address: string): Promise<{ rank: number; stats: PlayerStats } | null> {
    try {
      const leaderboard = await this.getLeaderboard(100); // Получаем топ 100
      const playerData = leaderboard.topPlayers.find(p => p.address.toLowerCase() === address.toLowerCase());
      
      if (playerData) {
        return {
          rank: playerData.rank,
          stats: playerData
        };
      }
      
      // Если игрок не в топе, получаем его статистику отдельно
      const stats = await this.getStats(address);
      const transactionCount = await this.getPlayerTransactionCount(address);
      
      if (transactionCount > 0) {
        const winRate = (stats.numWins / transactionCount) * 100;
        
        return {
          rank: leaderboard.topPlayers.length + 1,
          stats: {
            address,
            totalTransactions: transactionCount,
            totalWins: stats.numWins,
            totalWinAmount: stats.totalWins.toString(),
            winRate,
            rank: leaderboard.topPlayers.length + 1
          }
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting player rank:', error);
      return null;
    }
  }
}
