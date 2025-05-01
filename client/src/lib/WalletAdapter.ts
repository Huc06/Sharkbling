import { useSuiClient, useCurrentAccount, useSuiClientContext, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiObjectChange, SuiTransactionBlockResponse, TransactionEffects } from '@mysten/sui.js/client';
import { useState } from 'react';

interface CreateMarketParams {
  title: string;
  description: string;
  resolutionTime: number;
  minAmount: number;
}

interface MarketDetails {
  marketId?: string;
  title?: string;
  description?: string;
  minAmount?: number;
  resolutionTime?: number;
}

export interface TransactionResult {
  loading: boolean;
  error: string | null;
  success: boolean;
  txId?: string;
  marketDetails?: MarketDetails;
  rawResponse?: SuiTransactionBlockResponse;
}

interface ExtendedTransactionResponse extends SuiTransactionBlockResponse {
  effects: TransactionEffects;
}

export function useWalletAdapter() {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const clientContext = useSuiClientContext();
  const currentNetwork = clientContext.network || 'testnet';

  // Set default package ID or get from environment
  const PACKAGE_ID = import.meta.env.VITE_SUI_PACKAGE_ID || "0x2a99144719afd614c77be6b58644d15c3cec9e73fcbf7f319753f27556a65c3a";

  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const [txResult, setTxResult] = useState<TransactionResult>({
    loading: false,
    error: null,
    success: false
  });

  const extractMarketId = (result: ExtendedTransactionResponse) => {
    console.log('Raw transaction response:', JSON.stringify(result, null, 2));
    
    if (!result.objectChanges) {
      console.error('No object changes found in response');
      return undefined;
    }

    const createdMarket = result.objectChanges.find((obj: SuiObjectChange) => {
      console.log('Checking object:', JSON.stringify(obj, null, 2));
      return (
        obj.type === "created" &&
        'objectType' in obj &&
        typeof obj.objectType === 'string' &&
        obj.objectType.includes("prediction_market::Market")
      );
    });

    if (!createdMarket) {
      console.error('No market object found in changes');
      return undefined;
    }

    console.log('Found market object:', JSON.stringify(createdMarket, null, 2));
    return 'objectId' in createdMarket ? createdMarket.objectId : undefined;
  };

  const executeTransaction = async (tx: TransactionBlock, params?: CreateMarketParams) => {
    console.log('Transaction params:', JSON.stringify(params, null, 2));
    setTxResult({ loading: true, error: null, success: false });
    
    try {
      console.log('Serialized transaction:', JSON.stringify(tx.serialize(), null, 2));
      
      const result = await signAndExecute({ 
        transaction: tx.serialize(),
      }) as unknown as ExtendedTransactionResponse;

      console.log('Transaction execution result:', JSON.stringify(result, null, 2));
      
      const marketId = extractMarketId(result);
      console.log('Extracted market ID:', marketId);

      const marketDetails: MarketDetails = params ? {
        marketId,
        ...params
      } : { marketId };
      console.log('Market details:', marketDetails);

      setTxResult({
        loading: false,
        error: null,
        success: true,
        txId: result.digest,
        marketDetails,
        rawResponse: result
      });

      return {
        digest: result.digest,
        success: true
      };
    } catch (error) {
      console.error('Transaction error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error
      });
      setTxResult({
        loading: false,
        error: error instanceof Error ? error.message : 'Transaction failed',
        success: false
      });
      throw error;
    }
  };

  const createPredictionMarket = async (params: CreateMarketParams) => {
    if (!currentAccount) return null;
    if (!params.title || !params.description || !params.resolutionTime || !params.minAmount) {
      throw new Error("Missing required parameters");
    }

    const tx = new TransactionBlock();
    const amountInMist = BigInt(Math.floor(params.minAmount * 1_000_000_000));
    const [coin] = tx.splitCoins(tx.gas, [amountInMist]);

    tx.moveCall({
      target: `${PACKAGE_ID}::prediction_market::create_market`,
      arguments: [
        tx.pure(params.title),
        tx.pure(params.description),
        tx.pure(params.resolutionTime),
        tx.pure(amountInMist),
        coin,
      ],
    });

    return executeTransaction(tx, params);
  };

  const placePrediction = async (marketId: string, prediction: boolean, amount: number) => {
    if (!currentAccount) return null;
    if (amount < 0.00001) {
      throw new Error("Amount too small, minimum is 0.00001 SUI");
    }

    const tx = new TransactionBlock();
    const amountInMist = BigInt(Math.floor(amount * 1_000_000_000));
    const [predictionCoin] = tx.splitCoins(tx.gas, [amountInMist]);

    tx.moveCall({
      target: `${PACKAGE_ID}::prediction_market::place_prediction`,
      arguments: [
        tx.object(marketId),
        predictionCoin,
        tx.pure(prediction)
      ],
    });

    return executeTransaction(tx);
  };

  const claimWinnings = async (marketId: string) => {
    if (!currentAccount) return null;

    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${PACKAGE_ID}::prediction_market::claim_winnings`,
      arguments: [tx.object(marketId)],
    });

    return executeTransaction(tx);
  };

  return {
    isConnected: !!currentAccount,
    walletAddress: currentAccount?.address,
    network: currentNetwork,
    suiClient,
    txResult,
    createPredictionMarket,
    placePrediction,
    claimWinnings,
    getRawTxResponse: () => txResult.rawResponse
  };
}
