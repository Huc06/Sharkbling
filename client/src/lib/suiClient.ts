import { Connection } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

// For testing/development use testnet or devnet
// For production use mainnet
const SUI_NETWORK = "testnet";
const rpcUrl = `https://fullnode.${SUI_NETWORK}.sui.io`;

export const getExplorerUrl = (txDigest: string) => {
  return `https://suiexplorer.com/txblock/${txDigest}?network=${SUI_NETWORK}`;
};

// Connect to Sui blockchain
export const connection = new Connection({
  fullnode: rpcUrl,
});

// Package ID should be updated with the deployed prediction market package ID
export const PACKAGE_ID = process.env.SUI_PACKAGE_ID || "";

// Helper function to create a market
export const createPredictionMarket = async (
  walletAddress: string,
  title: string,
  description: string,
  endTime: number,
  initialPool: number,
  marketFee: number
) => {
  try {
    // Create a new transaction block
    const tx = new TransactionBlock();
    
    // Call the move function to create a market
    // This assumes the Move contract has a create_market function with the right parameters
    tx.moveCall({
      target: `${PACKAGE_ID}::prediction_market::create_market`,
      arguments: [
        tx.pure(title),
        tx.pure(description),
        tx.pure(endTime),
        tx.pure(marketFee),
        tx.pure(initialPool),
      ],
    });
    
    // In a real implementation, we would sign and execute this transaction
    // through a wallet adapter like @mysten/wallet-adapter-react
    console.log("Transaction created to create market:", tx);
    
    // Normally would return the transaction digest but for now we'll return a mock result
    return {
      success: true,
      transactionDigest: "mock_transaction_digest",
    };
  } catch (error) {
    console.error("Error creating prediction market:", error);
    return {
      success: false,
      error,
    };
  }
};

// Helper function to place a bet
export const placePrediction = async (
  walletAddress: string,
  marketId: string,
  prediction: "yes" | "no",
  amount: number
) => {
  try {
    // Create a new transaction block
    const tx = new TransactionBlock();
    
    // Call the move function to place a prediction
    tx.moveCall({
      target: `${PACKAGE_ID}::prediction_market::place_prediction`,
      arguments: [
        tx.pure(marketId),
        tx.pure(prediction === "yes" ? true : false),
        tx.pure(amount),
      ],
    });
    
    console.log("Transaction created to place prediction:", tx);
    
    return {
      success: true,
      transactionDigest: "mock_transaction_digest",
    };
  } catch (error) {
    console.error("Error placing prediction:", error);
    return {
      success: false,
      error,
    };
  }
};

// Helper function to claim winnings
export const claimWinnings = async (
  walletAddress: string,
  marketId: string,
  predictionId: string
) => {
  try {
    // Create a new transaction block
    const tx = new TransactionBlock();
    
    // Call the move function to claim winnings
    tx.moveCall({
      target: `${PACKAGE_ID}::prediction_market::claim_winnings`,
      arguments: [
        tx.pure(marketId),
        tx.pure(predictionId),
      ],
    });
    
    console.log("Transaction created to claim winnings:", tx);
    
    return {
      success: true,
      transactionDigest: "mock_transaction_digest",
    };
  } catch (error) {
    console.error("Error claiming winnings:", error);
    return {
      success: false,
      error,
    };
  }
};

// Helper function to mint NFT reputation token
export const mintReputationNFT = async (
  walletAddress: string,
  nftType: string,
  score: number
) => {
  try {
    // Create a new transaction block
    const tx = new TransactionBlock();
    
    // Call the move function to mint an NFT
    tx.moveCall({
      target: `${PACKAGE_ID}::reputation_nft::mint_nft`,
      arguments: [
        tx.pure(nftType),
        tx.pure(score),
      ],
    });
    
    console.log("Transaction created to mint NFT:", tx);
    
    return {
      success: true,
      transactionDigest: "mock_transaction_digest",
    };
  } catch (error) {
    console.error("Error minting NFT:", error);
    return {
      success: false,
      error,
    };
  }
};
