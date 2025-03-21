import { useSuiClient, useCurrentAccount, useSuiClientContext } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';

export function useWalletAdapter() {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const clientContext = useSuiClientContext();
  const currentNetwork = clientContext.network || 'testnet';

  // Set default package ID or get from environment
  const PACKAGE_ID = import.meta.env.VITE_SUI_PACKAGE_ID || "";

  const executeTransaction = async (transactionBlock: TransactionBlock) => {
    if (!currentAccount) {
      console.error('No connected wallet');
      return null;
    }

    try {
      // For dapp-kit, we don't need to manually execute transactions
      // This is just a stub for future implementation with wallet SDK
      console.log('Would execute transaction with block:', transactionBlock);
      return { success: true, transactionBlock };
    } catch (e) {
      console.error('Transaction failed:', e);
      return null;
    }
  };

  const createPredictionMarket = async (
    title: string,
    description: string,
    initialPool: number,
    endDate: number,
    fee: number
  ) => {
    if (!currentAccount) return null;

    const txb = new TransactionBlock();
    
    // Call the contract module function
    txb.moveCall({
      target: `${PACKAGE_ID}::prediction_market::create_market`,
      arguments: [
        txb.pure(title),
        txb.pure(description),
        txb.pure(initialPool),
        txb.pure(endDate),
        txb.pure(fee)
      ],
    });
    
    return executeTransaction(txb);
  };

  const placePrediction = async (
    marketId: string,
    prediction: 'yes' | 'no',
    amount: number
  ) => {
    if (!currentAccount) return null;

    const txb = new TransactionBlock();
    
    // Call the contract module function
    txb.moveCall({
      target: `${PACKAGE_ID}::prediction_market::place_prediction`,
      arguments: [
        txb.pure(marketId),
        txb.pure(prediction === 'yes'),
        txb.pure(amount),
      ],
    });
    
    return executeTransaction(txb);
  };

  const claimWinnings = async (
    marketId: string
  ) => {
    if (!currentAccount) return null;

    const txb = new TransactionBlock();
    
    // Call the contract module function
    txb.moveCall({
      target: `${PACKAGE_ID}::prediction_market::claim_winnings`,
      arguments: [
        txb.pure(marketId),
      ],
    });
    
    return executeTransaction(txb);
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