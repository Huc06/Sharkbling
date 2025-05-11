import { useCurrentAccount, useConnectWallet, useDisconnectWallet, useSignPersonalMessage } from '@mysten/dapp-kit';
import { useWalletAdapter } from '@/lib/WalletAdapter';
import { useCallback, useState } from 'react';

export function useSuiWallet() {
  const currentAccount = useCurrentAccount();
  const connectWallet = useConnectWallet();
  const disconnectWallet = useDisconnectWallet();
  const [modalOpen, setModalOpen] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  
  // Get additional wallet functionality from our adapter
  const walletAdapter = useWalletAdapter();
  
  // Use the signPersonalMessage hook from dapp-kit
  const signPersonalMessage = useSignPersonalMessage();

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
      if (currentAccount?.address){
        localStorage.removeItem(`signature_${currentAccount.address}`);
        setSignature(null);
      }
      disconnectWallet.mutate();
      return true;
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      return false;
    }
  }, [disconnectWallet]);

  const signMessage = useCallback(async (message: string = 'Đăng nhập vào chatbot') => {
    try {
      if (!currentAccount) {
        console.error('No account connected');
        return null;
      }
      
      // Check if we already have a valid signature in localStorage
      const savedSignature = localStorage.getItem(`signature_${currentAccount.address}`);
      if (savedSignature) {
        console.log('Using saved signature from localStorage');
        setSignature(savedSignature);
        return savedSignature;
      }
      
      console.log('Signing message with account:', currentAccount);
      console.log('Message to sign:', message);
      
      // Encode message to Uint8Array
      const encodedMessage = new TextEncoder().encode(message);
      
      // Sign the message
      const result = await signPersonalMessage.mutateAsync({
        message: encodedMessage,
      });
      
      console.log('Signature:', result.signature);
      
      // Store signature in state
      setSignature(result.signature);
      
      // Save signature to localStorage with the wallet address as part of the key
      localStorage.setItem(`signature_${currentAccount.address}`, result.signature);
      
      return result.signature;
    } catch (error) {
      console.error('Failed to sign message:', error);
      return null;
    }
  }, [currentAccount, signPersonalMessage]);

  // Get adapter information but don't overwrite our values
  const { 
    walletAddress: adapterWalletAddress, 
    isConnected: adapterIsConnected,
    ...adapterRest 
  } = walletAdapter;

  const clearSignature = useCallback(() => {
    if (currentAccount?.address) {
      localStorage.removeItem(`signature_${currentAccount.address}`);
      setSignature(null);
      return true;
    }
    return false;
  }, [currentAccount]);

  return {
    walletAddress: currentAccount?.address || null,
    isConnected: !!currentAccount,
    isConnecting: connectWallet.isPending,
    connectWallet: handleConnectWallet,
    disconnectWallet: handleDisconnectWallet,
    signMessage,
    signature,
    clearSignature,
    modalOpen,
    openConnectWalletModal,
    closeConnectWalletModal,
    currentAccount,
    ...adapterRest
  };
}
