import { createContext, useContext, useState, ReactNode } from "react";
import { Market, Prediction } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSuiWallet } from "@/hooks/useSuiWallet";
import { useWalletAdapter } from "@/lib/WalletAdapter";

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
  const { walletAddress, isConnected } = useSuiWallet();
  const walletAdapter = useWalletAdapter();

  // Create a new prediction market
  const createMarket = async (marketData: Omit<Market, "id" | "createdAt" | "yesPool" | "noPool" | "result">): Promise<Market | null> => {
    if (!isConnected) {
      toast({
        title: "Ví chưa được kết nối",
        description: "Vui lòng kết nối ví của bạn để tạo thị trường dự đoán.",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsCreatingMarket(true);
      
      // Step 1: Create transaction on blockchain
      toast({
        title: "Đang xử lý",
        description: "Đang tạo thị trường dự đoán trên blockchain...",
      });
      
      // Calculate end date as timestamp for blockchain
      const endDateTimestamp = Math.floor(new Date(marketData.endDate).getTime() / 1000);
      
      // Execute transaction on Sui blockchain
      try {
        const txResult = await walletAdapter.createPredictionMarket(
          marketData.title,
          marketData.description,
          marketData.initialPool,
          endDateTimestamp,
          marketData.marketFee
        );
        
        if (!txResult) throw new Error("Blockchain transaction failed");
        
        console.log("Prediction market created on blockchain:", txResult);
      } catch (blockchainError) {
        console.error("Blockchain transaction failed:", blockchainError);
        toast({
          title: "Giao dịch blockchain thất bại",
          description: "Không thể tạo thị trường dự đoán trên blockchain. Vui lòng thử lại.",
          variant: "destructive",
        });
        throw blockchainError;
      }
      
      // Step 2: Save to database
      const response = await apiRequest("POST", "/api/markets", marketData);
      const market = await response.json();
      
      toast({
        title: "Thị trường đã được tạo",
        description: "Thị trường dự đoán của bạn đã được tạo thành công.",
      });

      // Invalidate markets query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/markets'] });
      
      return market;
    } catch (error) {
      console.error("Failed to create market:", error);
      toast({
        title: "Tạo thị trường thất bại",
        description: "Không thể tạo thị trường dự đoán. Vui lòng thử lại.",
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
        title: "Ví chưa được kết nối",
        description: "Vui lòng kết nối ví của bạn để đặt cược.",
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
      
      // Step 1: Execute blockchain transaction
      toast({
        title: "Đang xử lý",
        description: "Đang đặt cược trên blockchain...",
      });
      
      try {
        // Convert marketId to string for blockchain (in real implementation, this would be the actual blockchain object ID)
        const blockchainMarketId = market.id.toString();
        
        // Execute transaction on Sui blockchain
        const txResult = await walletAdapter.placePrediction(
          blockchainMarketId,
          prediction,
          amount
        );
        
        if (!txResult) throw new Error("Blockchain transaction failed");
        
        console.log("Prediction placed on blockchain:", txResult);
      } catch (blockchainError) {
        console.error("Blockchain transaction failed:", blockchainError);
        toast({
          title: "Giao dịch blockchain thất bại",
          description: "Không thể đặt cược trên blockchain. Vui lòng thử lại.",
          variant: "destructive",
        });
        throw blockchainError;
      }
      
      // Step 2: Save prediction to database
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
        title: "Đặt cược thành công",
        description: `Bạn đã đặt cược thành công ${amount} SUI vào "${prediction === 'yes' ? 'CÓ' : 'KHÔNG'}"`,
      });
      
      // Invalidate market and predictions queries
      queryClient.invalidateQueries({ queryKey: [`/api/markets/${marketId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/markets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/predictions'] });
      
      return result;
    } catch (error) {
      console.error("Failed to place bet:", error);
      toast({
        title: "Đặt cược thất bại",
        description: "Không thể đặt cược của bạn. Vui lòng thử lại.",
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
