import { createContext, useContext, useState, ReactNode } from "react";
import { Market, Prediction } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "./WalletContext";

interface MarketContextType {
  createMarket: (marketData: Omit<Market, "id" | "createdAt" | "yesPool" | "noPool" | "result">) => Promise<Market | null>;
  placeBet: (marketId: number, prediction: "yes" | "no", amount: number) => Promise<Prediction | null>;
  selectedMarket: Market | null;
  setSelectedMarket: (market: Market | null) => void;
  isCreatingMarket: boolean;
  isPlacingBet: boolean;
}

const MarketsContext = createContext<MarketContextType>({
  createMarket: async () => null,
  placeBet: async () => null,
  selectedMarket: null,
  setSelectedMarket: () => {},
  isCreatingMarket: false,
  isPlacingBet: false,
});

export const useMarkets = () => useContext(MarketsContext);

interface MarketsProviderProps {
  children: ReactNode;
}

export const MarketsProvider = ({ children }: MarketsProviderProps) => {
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [isCreatingMarket, setIsCreatingMarket] = useState(false);
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { walletAddress, isConnected } = useWallet();

  // Create a new prediction market
  const createMarket = async (marketData: Omit<Market, "id" | "createdAt" | "yesPool" | "noPool" | "result">): Promise<Market | null> => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a prediction market.",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsCreatingMarket(true);
      
      const response = await apiRequest("POST", "/api/markets", marketData);
      const market = await response.json();
      
      toast({
        title: "Market Created",
        description: "Your prediction market has been created successfully.",
      });

      // Invalidate markets query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/markets'] });
      
      return market;
    } catch (error) {
      console.error("Failed to create market:", error);
      toast({
        title: "Market Creation Failed",
        description: "Could not create prediction market. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsCreatingMarket(false);
    }
  };

  // Place a bet on a prediction market
  const placeBet = async (marketId: number, prediction: "yes" | "no", amount: number): Promise<Prediction | null> => {
    if (!isConnected || !walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to place a bet.",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsPlacingBet(true);
      
      // Calculate odds based on current pools
      const market = await queryClient.fetchQuery({
        queryKey: [`/api/markets/${marketId}`],
        queryFn: async () => {
          const res = await fetch(`/api/markets/${marketId}`);
          if (!res.ok) throw new Error("Failed to fetch market");
          return res.json();
        },
      });
      
      const totalPool = market.yesPool + market.noPool;
      let odds = 0;
      
      if (prediction === "yes") {
        odds = totalPool / market.yesPool;
      } else {
        odds = totalPool / market.noPool;
      }
      
      // Create prediction
      const predictionData = {
        marketId,
        walletAddress,
        prediction,
        amount,
        odds,
      };
      
      const response = await apiRequest("POST", "/api/predictions", predictionData);
      const result = await response.json();
      
      toast({
        title: "Bet Placed",
        description: `You have successfully placed a bet of ${amount} SUI on "${prediction.toUpperCase()}"`,
      });
      
      // Invalidate market and predictions queries
      queryClient.invalidateQueries({ queryKey: [`/api/markets/${marketId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/markets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/predictions'] });
      
      return result;
    } catch (error) {
      console.error("Failed to place bet:", error);
      toast({
        title: "Bet Failed",
        description: "Could not place your bet. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsPlacingBet(false);
    }
  };

  return (
    <MarketsContext.Provider
      value={{
        createMarket,
        placeBet,
        selectedMarket,
        setSelectedMarket,
        isCreatingMarket,
        isPlacingBet,
      }}
    >
      {children}
    </MarketsContext.Provider>
  );
};
