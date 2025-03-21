import { useCurrentAccount, useConnectWallet, useDisconnectWallet } from '@mysten/dapp-kit';
import { useWalletAdapter } from '@/lib/WalletAdapter';
import { useCallback, useState } from 'react';

export function useSuiWallet() {
  const currentAccount = useCurrentAccount();
  const connectWallet = useConnectWallet();
  const disconnectWallet = useDisconnectWallet();
  const [modalOpen, setModalOpen] = useState(false);
  
  // Get additional wallet functionality from our adapter
  const walletAdapter = useWalletAdapter();

  const openConnectWalletModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const closeConnectWalletModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleConnectWallet = useCallback(async () => {
    try {
      // For dapp-kit, we don't need to provide specific wallet info as it's handled by the UI
      // The ConnectButton component handles wallet selection
      console.log('Wallet connection triggered via hook');
      return true;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return false;
    }
  }, []);

  const handleDisconnectWallet = useCallback(() => {
    try {
      disconnectWallet.mutate();
      return true;
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      return false;
    }
  }, [disconnectWallet]);

  // Get adapter information but don't overwrite our values
  const { 
    walletAddress: adapterWalletAddress, 
    isConnected: adapterIsConnected,
    ...adapterRest 
  } = walletAdapter;

  return {
    walletAddress: currentAccount?.address || null,
    isConnected: !!currentAccount,
    isConnecting: connectWallet.isPending,
    connectWallet: handleConnectWallet,
    disconnectWallet: handleDisconnectWallet,
    modalOpen,
    openConnectWalletModal,
    closeConnectWalletModal,
    currentAccount,
    ...adapterRest
  };
}