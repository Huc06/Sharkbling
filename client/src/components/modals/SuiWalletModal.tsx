import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSuiWallet } from "@/hooks/useSuiWallet";
import { Wallet } from "lucide-react";

interface SuiWalletModalProps {
  open: boolean;
  onClose: () => void;
}

const SuiWalletModal = ({ open, onClose }: SuiWalletModalProps) => {
  const { connectWallet } = useSuiWallet();

  const handleConnect = async () => {
    try {
      await connectWallet();
      onClose();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

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
          {/* Sui Wallet */}
          <Button onClick={handleConnect} className="flex items-center justify-center space-x-2">
            <Wallet className="w-5 h-5 mr-2" />
            <span>Kết nối với Sui Wallet</span>
          </Button>
          
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