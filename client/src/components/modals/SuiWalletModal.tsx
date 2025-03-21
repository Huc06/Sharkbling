import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConnectButton } from '@mysten/dapp-kit';

interface SuiWalletModalProps {
  open: boolean;
  onClose: () => void;
}

const SuiWalletModal = ({ open, onClose }: SuiWalletModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-heading font-bold">Kết nối ví</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-slate-600 text-sm mb-4">Kết nối ví Sui của bạn để tham gia vào thị trường dự đoán.</p>
          
          <div className="space-y-3 mb-6">
            <ConnectButton />
          </div>
          
          <div className="text-xs text-slate-500 text-center mt-4">
            Bằng cách kết nối, bạn đồng ý với <a href="#" className="text-primary-500">Điều khoản dịch vụ</a> và <a href="#" className="text-primary-500">Chính sách bảo mật</a> của chúng tôi.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuiWalletModal;