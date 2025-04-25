import { useSuiClient, useCurrentAccount, useSuiClientContext, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

interface CreateMarketParams {
  title: string;
  description: string;
  resolutionTime: number;
  minAmount: number;
  coinObjectId: string;
}

export function useWalletAdapter() {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const clientContext = useSuiClientContext();
  const currentNetwork = clientContext.network || 'testnet';

  // Set default package ID or get from environment
  const PACKAGE_ID = import.meta.env.VITE_SUI_PACKAGE_ID || "0x2a99144719afd614c77be6b58644d15c3cec9e73fcbf7f319753f27556a65c3a";

  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const createPredictionMarket = async (params: CreateMarketParams) => {
    if (!currentAccount) return null;
    if (!params.title || !params.description || !params.resolutionTime || 
        !params.minAmount || !params.coinObjectId) {
      throw new Error("Missing required parameters");
    }

    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::prediction_market::create_market`,
      arguments: [
        tx.pure.string(params.title),
        tx.pure.string(params.description),
        tx.pure.u64(params.resolutionTime),
        tx.pure.u64(params.minAmount),
        tx.object(params.coinObjectId),
      ],
    });

    return signAndExecute({ transaction: tx });
  };

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
