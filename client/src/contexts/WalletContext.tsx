import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface WalletContextType {
  walletAddress: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType>({
  walletAddress: null,
  isConnected: false,
  isConnecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  // Check if wallet was previously connected
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setWalletAddress(savedAddress);
    }
  }, []);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      
      // Check if Sui wallet is available
      if (!(window as any).suiWallet) {
        toast({
          title: "Wallet Not Found",
          description: "Please install the Sui Wallet extension",
          variant: "destructive",
        });
        return;
      }
      
      // Request connection
      // This is a simplified version - in real app, use @mysten/sui.js wallet adapter
      const wallet = (window as any).suiWallet;
      
      // Mock wallet connection for development
      // In production, this would use actual Sui wallet API
      const mockAddress = `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`;
      
      setWalletAddress(mockAddress);
      localStorage.setItem("walletAddress", mockAddress);
      
      // Register user in the backend
      if (mockAddress) {
        try {
          await apiRequest("POST", "/api/users", { walletAddress: mockAddress });
        } catch (error) {
          // User might already exist, which is fine
          console.log("User registration error:", error);
        }
      }
      
      toast({
        title: "Wallet Connected",
        description: "Your Sui wallet has been connected successfully.",
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to your wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    localStorage.removeItem("walletAddress");
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        isConnected: !!walletAddress,
        isConnecting,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
