import { useWallet } from "@/contexts/WalletContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ConnectWalletModalProps {
  onClose: () => void;
}

const ConnectWalletModal = ({ onClose }: ConnectWalletModalProps) => {
  const { connectWallet, isConnecting } = useWallet();

  const handleConnect = async (walletType: string) => {
    await connectWallet();
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-heading font-bold">Connect Wallet</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-slate-600 text-sm mb-4">Connect your Sui wallet to participate in prediction markets.</p>
          
          <div className="space-y-3 mb-6">
            <button 
              className="w-full flex items-center gap-3 border border-slate-200 rounded-lg p-3 hover:bg-slate-50"
              onClick={() => handleConnect("sui")}
              disabled={isConnecting}
            >
              <img 
                src="https://assets.website-files.com/63ebebee454bfd33d04cfc09/63ec095148f7dd5de0ed5b61_Sui-full-logo-p-500.png" 
                alt="Sui Wallet" 
                className="h-6" 
              />
              <span className="font-medium">Sui Wallet</span>
            </button>
            
            <button 
              className="w-full flex items-center gap-3 border border-slate-200 rounded-lg p-3 hover:bg-slate-50"
              onClick={() => handleConnect("ethos")}
              disabled={isConnecting}
            >
              <img 
                src="https://storage.googleapis.com/ethos-so-prod-storage/asset/ed758651-de5a-4f3d-97ea-b7f706ec31cc" 
                alt="Ethos Wallet" 
                className="h-6" 
              />
              <span className="font-medium">Ethos Wallet</span>
            </button>
            
            <button 
              className="w-full flex items-center gap-3 border border-slate-200 rounded-lg p-3 hover:bg-slate-50"
              onClick={() => handleConnect("martian")}
              disabled={isConnecting}
            >
              <img 
                src="https://www.martianwallet.xyz/assets/martian.png" 
                alt="Martian Wallet" 
                className="h-6" 
              />
              <span className="font-medium">Martian</span>
            </button>
          </div>
          
          <div className="text-xs text-slate-500 text-center">
            By connecting, you agree to our <a href="#" className="text-primary-500">Terms of Service</a> and <a href="#" className="text-primary-500">Privacy Policy</a>.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectWalletModal;
