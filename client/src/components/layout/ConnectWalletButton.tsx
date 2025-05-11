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
import { Copy, LogOut, Wallet, ChevronDown, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WalletConnectButton = () => {
  const { isConnected, walletAddress, disconnectWallet, signMessage } =
    useSuiWallet();
  const { toast } = useToast();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const copyWalletAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast({
        title: "Address copied",
        description: "Wallet address has been copied to the clipboard.",
      });
    }
    setDropdownOpen(false);
  };

  const disconnect = () => {
    disconnectWallet();
    setDropdownOpen(false);
  };

  const signLoginMessage = async () => {
    const signature = await signMessage("Sign in to the chatbot");
    if (signature) {
      toast({
        title: "Message signed",
        description: "Signature was successfully created.",
      });
    }
    setDropdownOpen(false);
  };

  const formatWalletAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <ConnectButton>
      {({ connected, connecting, connect }) => {
        if (connected && isConnected && walletAddress) {
          return (
            <DropdownMenu open={isDropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-primary/20 theme-secondary"
                >
                  <Wallet className="w-4 h-4 mr-2 theme-secondary" />
                  <span className="mr-1">
                    {formatWalletAddress(walletAddress)}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={copyWalletAddress}>
                  <Copy className="w-4 h-4 mr-2 theme-secondary" />
                  <span>Copy</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signLoginMessage}>
                  <MessageSquare className="w-4 h-4 mr-2 theme-secondary" />
                  <span>Sign Message</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={disconnect}>
                  <LogOut className="w-4 h-4 mr-2 theme-secondary" />
                  <span>Disconnect</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return (
          <Button
            onClick={connect}
            disabled={connecting}
            className="bg-theme-secondary text-white"
          >
            {connecting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Connecting...
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

export default WalletConnectButton;
