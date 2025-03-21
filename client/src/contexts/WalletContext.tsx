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
      
      // Trong môi trường phát triển, luôn giả lập kết nối ví thành công
      // Không kiểm tra window.suiWallet vì chúng ta đang sử dụng dữ liệu giả lập
      
      // Tạo địa chỉ ví giả lập - địa chỉ cố định để tránh lỗi khi làm mới trang
      const mockAddress = "0x7def9ac8b0f44c565b3218e304a59df28d56f8a2";
      
      setWalletAddress(mockAddress);
      localStorage.setItem("walletAddress", mockAddress);
      
      // Đăng ký người dùng trong backend
      if (mockAddress) {
        try {
          await apiRequest("POST", "/api/users", { walletAddress: mockAddress });
        } catch (error) {
          // Người dùng có thể đã tồn tại, điều này không sao
          console.log("User registration error:", error);
        }
      }
      
      toast({
        title: "Ví đã kết nối",
        description: "Ví Sui của bạn đã được kết nối thành công.",
      });
    } catch (error) {
      console.error("Lỗi kết nối ví:", error);
      toast({
        title: "Kết nối thất bại",
        description: "Không thể kết nối với ví của bạn. Vui lòng thử lại.",
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
      title: "Ví đã ngắt kết nối",
      description: "Ví của bạn đã được ngắt kết nối.",
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
