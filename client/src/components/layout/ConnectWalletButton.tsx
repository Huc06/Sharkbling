import { ConnectButton } from '@mysten/dapp-kit';
import { Button } from "@/components/ui/button";
import { useSuiWallet } from "@/hooks/useSuiWallet";

const ConnectWalletButton = () => {
  // Use our custom hook to get wallet state and register user
  useSuiWallet();
  
  return (
    <ConnectButton>
      {(props: any) => {
        const { connected, connecting, connect, disconnect, walletName } = props;
        return connected ? (
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-white" 
            onClick={disconnect}
          >
            <span className="text-slate-800 font-medium">{walletName || 'Ví đã kết nối'}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        ) : (
          <Button 
            variant="secondary" 
            className="flex items-center gap-2 bg-primary-500 text-white hover:bg-primary-600" 
            onClick={connect}
            disabled={connecting}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.5 8H12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 3.5V12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{connecting ? 'Đang kết nối...' : 'Kết nối ví'}</span>
          </Button>
        );
      }}
    </ConnectButton>
  );
};

export default ConnectWalletButton;