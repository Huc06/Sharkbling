import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@mysten/dapp-kit";
import { useSuiWallet } from "@/hooks/useSuiWallet";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, LogOut, Wallet, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ConnectWalletButton = () => {
  const { isConnected, walletAddress, disconnectWallet } = useSuiWallet();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast({
        title: "Địa chỉ đã được sao chép",
        description: "Địa chỉ ví đã được sao chép vào clipboard",
      });
    }
    setIsOpen(false);
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setIsOpen(false);
  };

  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <ConnectButton>
      {({ connected, connecting, connect }) => {
        if (connected && isConnected && walletAddress) {
          return (
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-primary/20 theme-secondary  ">
                  <Wallet className="w-4 h-4 mr-2 theme-secondary" />
                  <span className="mr-1">{formatAddress(walletAddress)}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCopyAddress}>
                  <Copy className="w-4 h-4 mr-2 theme-secondary" />
                  <span>Coppy</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDisconnect }>
                  <LogOut className="w-4 h-4 mr-2 theme-secondary" />
                  <span>Disconnect</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return (
          <Button onClick={connect} disabled={connecting} className="bg-theme-secondary text-white">
            {connecting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Inprocess...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2 theme-secondary" />
                Connect Wallet
              </>
            )}
          </Button>
        );
      }}
    </ConnectButton>
  );
};

export default ConnectWalletButton;