## Description

A cyberpunk-styled web application for interacting with a smart contract on the **Somnia Testnet**. Users can "steal" the pool, participate in the Hall of Fame, and view transaction leaderboards.

## Features

- 🎯 **Steal the Pool** — attempt to steal the entire pool with calculated win chances
- 🏆 **Hall of Fame** — view the greatest winners
- 📊 **Top Transactions** — leaderboard of most active players  
- 🔗 **Wallet Integration** — connect with MetaMask via RainbowKit
- 🎨 **Cyberpunk Design** — neon colors and futuristic interface
- ⚡ **Optimized Performance** — minimal animations, efficient data fetching

## Quick Start

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/steal.git
   cd steal
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Tests

Run all tests:
```sh
npm test
```

## Linting and Formatting

- Lint the code:
  ```sh
  npm run lint
  ```
- Format the code:
  ```sh
  npm run format
  ```

## Architecture

### Main Components
- **src/App.tsx** — main application component with wallet integration
- **src/components/GameInterface.tsx** — main game interface with steal button
- **src/components/StartScreen.tsx** — welcome screen with wallet connection
- **src/components/TopLeftLeaderboard.tsx** — transaction leaderboard popup
- **src/components/TopLeftHallOfFame.tsx** — hall of fame popup
- **src/components/WalletConnectButton.tsx** — wallet connection component

### Hooks
- **src/hooks/useGameData.ts** — contract interaction and game state management
- **src/hooks/useWallet.ts** — wallet connection and network management
- **src/hooks/useLeaderboard.ts** — leaderboard data management

### Services
- **src/services/contractService.ts** — blockchain contract service

### Configuration
- **src/config/wagmi.ts** — wallet and network configuration
- **src/utils/contract.ts** — contract address and ABI
- **src/styles/** — cyberpunk styled-components

### Types
- **src/types/** — TypeScript type definitions

## Working with the Contract

- **Network:** Somnia Testnet (chainId: 50312)
- **Address:** see `src/utils/contract.ts`
- **ABI:** see `src/utils/contract.ts`

### Available Methods:
- `steal()` — attempt to steal the pool with calculated win chances
- `getPool()` — get current pool amount in STT tokens
- `getLastWinner()` — get the last winner's address
- `getHallOfFame()` — get list of hall of fame winners
- `getPlayerStats()` — get player's transaction statistics

### Game Mechanics:
- **Win Chance Calculation:** base 20% chance, increases with failed attempts
- **Pool Growth:** grows with each failed steal attempt
- **Hall of Fame:** top winners with highest winnings

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** styled-components with cyberpunk theme
- **Blockchain:** ethers.js for contract interaction
- **Wallet:** RainbowKit + wagmi for wallet connection
- **Network:** Somnia Testnet
- **Testing:** Jest + React Testing Library

## DevOps and Automation

- ESLint, Prettier, Husky (pre-commit hooks)
- GitHub Actions for CI (linting and tests)

## FAQ

- **How to connect wallet?** — Click "Connect Wallet" on the start screen and select MetaMask
- **What network should I use?** — Switch to Somnia Testnet (chainId: 50312) in MetaMask
- **How are win chances calculated?** — Base 20% chance, increases with your failed attempts
- **What happens when I steal successfully?** — You win the entire pool amount
- **What happens when I fail?** — Your transaction fee goes to the pool, increasing it for others
- **How to get on Hall of Fame?** — Win big amounts to get listed among top winners
- **Can I see other players' stats?** — Yes, check the "Top Transactions" leaderboard

## Performance Optimizations

- Cached contract calls (30-second cache)
- Reduced polling intervals (60 seconds)
- Minimal animations for better performance
- React.memo for component optimization

## Contacts

- [Questions and suggestions](mailto:your@email.com)
