import { useCurrentAccount } from '@mysten/dapp-kit';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "./use-toast";
import { useEffect } from 'react';

export function useSuiWallet() {
  const currentAccount = useCurrentAccount();
  const { toast } = useToast();
  const walletAddress = currentAccount?.address || null;
  const isConnected = !!currentAccount;

  // Register user in backend when wallet is connected
  useEffect(() => {
    if (walletAddress) {
      registerUser(walletAddress);
    }
  }, [walletAddress]);

  const registerUser = async (address: string) => {
    try {
      await apiRequest("POST", "/api/users", { walletAddress: address });
    } catch (error) {
      // User may already exist, this is fine
      console.log("User registration error:", error);
    }
  };

  // Display toast notification when wallet connects/disconnects
  useEffect(() => {
    if (isConnected) {
      toast({
        title: "Ví đã kết nối",
        description: "Ví Sui của bạn đã được kết nối thành công.",
      });
    }
  }, [isConnected]);

  return {
    walletAddress,
    isConnected,
    currentAccount
  };
}