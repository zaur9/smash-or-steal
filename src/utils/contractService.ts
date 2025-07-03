import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contract';

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
    return ethers.formatEther(balance);
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
    const ERC20_ABI = [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)"
    ];
    const token = new ethers.Contract(
      "0x7f89af8b3c0A68F536Ff20433927F4573CF001A3",
      ERC20_ABI,
      this.provider
    );
    const [raw, decimals] = await Promise.all([
      token.balanceOf(address),
      token.decimals()
    ]);
    return (Number(raw) / 10 ** Number(decimals)).toFixed(Number(decimals));
  }
} 