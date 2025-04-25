import { useSuiClient, useCurrentAccount, useSuiClientContext, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

export function useWalletAdapter() {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const clientContext = useSuiClientContext();
  const currentNetwork = clientContext.network || 'testnet';

  // Set default package ID or get from environment
  const PACKAGE_ID = import.meta.env.VITE_SUI_PACKAGE_ID || "0x2a99144719afd614c77be6b58644d15c3cec9e73fcbf7f319753f27556a65c3a";
  const OBJECT_ID = "0x852d1d6340775421f833ffcabf36a0dcb775f11fd2b56efa26512421aadef0ee";

  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const createPredictionMarket = async () => {
    if (!currentAccount) return null;

    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::prediction_market::create_market`,
      arguments: [
        tx.pure.string("Market 1"),
        tx.pure.string("A simple prediction market"),
        tx.pure.u64(1712951200),
        tx.pure.u64(2),
        tx.object(OBJECT_ID),
      ],
    });

    return signAndExecute({ transaction: tx });
  };

  // Ví dụ về placePrediction và claimWinnings (bạn cần kiểm tra lại args cho đúng contract)
  const placePrediction = async (
    marketId: string,
    prediction: boolean,
    amount: number
  ) => {
    if (!currentAccount) return null;

    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::prediction_market::place_prediction`,
      arguments: [
        tx.pure.string(marketId),
        tx.pure.bool(prediction),
        tx.pure.u64(amount),
      ],
    });

    return signAndExecute({ transaction: tx });
  };

  const claimWinnings = async (marketId: string) => {
    if (!currentAccount) return null;

    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::prediction_market::claim_winnings`,
      arguments: [
        tx.pure.string(marketId),
      ],
    });

    return signAndExecute({ transaction: tx });
  };

  return {
    isConnected: !!currentAccount,
    walletAddress: currentAccount?.address,
    network: currentNetwork,
    suiClient,
    createPredictionMarket,
    placePrediction,
    claimWinnings
  };
}
