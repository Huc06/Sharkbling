import { useState } from "react";
import CreateMarketModal from "../modals/CreateMarketModal";
import { useWallet } from "@/contexts/WalletContext";
import ConnectWalletModal from "../modals/ConnectWalletModal";

const CreateMarketBanner = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { isConnected } = useWallet();
  const [showConnectModal, setShowConnectModal] = useState(false);

  const handleCreateMarketClick = () => {
    if (!isConnected) {
      setShowConnectModal(true);
      return;
    }
    setShowCreateModal(true);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="text-white">
            <h2 className="text-xl font-heading font-bold mb-2">Create Your Own Prediction Market</h2>
            <p className="text-white text-opacity-80">Launch a new market based on any social media metric or event.</p>
          </div>
          <button 
            className="bg-white text-primary-600 py-3 px-6 rounded-lg text-sm font-medium shadow-sm hover:shadow whitespace-nowrap" 
            onClick={handleCreateMarketClick}
          >
            Create Market
          </button>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateMarketModal onClose={() => setShowCreateModal(false)} />
      )}

      {showConnectModal && (
        <ConnectWalletModal onClose={() => setShowConnectModal(false)} />
      )}
    </>
  );
};

export default CreateMarketBanner;
