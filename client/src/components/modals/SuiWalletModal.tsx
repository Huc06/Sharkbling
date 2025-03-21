import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSuiWallet } from "@/hooks/useSuiWallet";
import { Wallet } from "lucide-react";
import { ConnectButton } from '@mysten/dapp-kit';

interface SuiWalletModalProps {
  open: boolean;
  onClose: () => void;
}

const SuiWalletModal = ({ open, onClose }: SuiWalletModalProps) => {
  const { isConnected, isConnecting } = useSuiWallet();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Kết nối ví Sui</DialogTitle>
          <DialogDescription className="text-center">
            Chọn phương thức kết nối ví của bạn để tham gia dự đoán và kiếm phần thưởng.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Sui Wallet using dapp-kit's ConnectButton */}
          <ConnectButton>
            {({ connected, connecting, connect }) => (
              <Button 
                onClick={() => {
                  connect();
                  if (connected) onClose();
                }}
                disabled={connecting || isConnecting}
                className="flex items-center justify-center space-x-2 w-full"
              >
                {connecting || isConnecting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Đang kết nối...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5 mr-2" />
                    <span>Kết nối với Sui Wallet</span>
                  </>
                )}
              </Button>
            )}
          </ConnectButton>
          
          {/* Additional wallet options can be added here */}
          <div className="text-xs text-center text-slate-500 mt-4">
            Bằng cách kết nối, bạn đồng ý với các điều khoản và điều kiện sử dụng của ứng dụng.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuiWalletModal;