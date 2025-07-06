## Description

A web application for interacting with a smart contract on the **Somnia Testnet**. Users can "smash" or "steal" the pool, participate in the Hall of Fame, and view the winners' history.

## Quick Start

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/smash-or-steal.git
   cd smash-or-steal
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

- **src/App.tsx** — main application component
- **src/components/** — UI components
- **src/utils/useGameData.ts** — hook for contract and state management
- **src/utils/contract.ts** — contract address and ABI
- **src/styles/** — styles

## Working with the Contract

- Network: **Somnia Testnet** (chainId: 50312)
- Address: see `src/utils/contract.ts`
- ABI: see `src/utils/contract.ts`
- Methods:
  - `smash()` — Smash the pool
  - `steal()` — Try to steal the pool
  - `getPool()` — Get the current pool amount
  - `getLastWinner()` — Get the last winner
  - `getHallOfFame()` — Get the Hall of Fame

## DevOps and Automation

- ESLint, Prettier, Husky (pre-commit hooks)
- GitHub Actions for CI (linting and tests)

## FAQ

- **How to connect MetaMask?** — Click "Connect MetaMask" on the main screen.
- **What if the script doesn't start?** — Check the Execution Policy in PowerShell.
- **How to change account?** — Switch the account in MetaMask, the page will update automatically.
- **Which network does the app use?** — Only Somnia Testnet (chainId: 50312). Switch to it in MetaMask.

## Contacts

- [Questions and suggestions](mailto:your@email.com)
