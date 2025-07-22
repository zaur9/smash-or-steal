export const toastMessages = {
  installMetaMask: "Please install MetaMask!",
  walletConnected: "Wallet connected!",
  walletFailed: "Wallet connection failed or was rejected.",
  txSent: "Transaction sent! Waiting...",
  stealSuccess: "STEAL! Success! 🎉",
  stealTry: "Trying to Steal...",
  stealFinished: "Steal finished",
  stealFailed: "Steal failed"
};

export function getToastMessage(key: string): string {
  return toastMessages[key as keyof typeof toastMessages] || key;
}
