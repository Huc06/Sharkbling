import { ComponentType } from "react";

declare module "@mysten/dapp-kit" {
  export interface ConnectButtonProps {
    children?: (props: {
      connected: boolean;
      connecting: boolean;
      connect: () => void;
      disconnect: () => void;
      walletName?: string;
    }) => React.ReactNode;
    className?: string;
  }

  export const ConnectButton: ComponentType<ConnectButtonProps>;
  export const useCurrentAccount: () => any;
  export const SuiClientProvider: ComponentType<any>;
  export const WalletProvider: ComponentType<any>;
  export function createNetworkConfig(networks: Record<string, { url: string }>): { networkConfig: Record<string, { url: string }> };
}