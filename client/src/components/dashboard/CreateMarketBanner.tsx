
import { useState } from "react";
import CreateMarketModal from "../modals/CreateMarketModal";
import { useSuiWallet } from "@/hooks/useSuiWallet"; 
import ConnectWalletModal from "../modals/ConnectWalletModal";

const CreateMarketBanner = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { isConnected, openConnectWalletModal } = useSuiWallet();
  const [showConnectModal, setShowConnectModal] = useState(false);

  const handleCreateMarketClick = () => {
    if (!isConnected) {
      openConnectWalletModal();
      return;
    }
    setShowCreateModal(true);
  };

  return (
    <>
      <div className="bg-violet-600 rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="text-white">
            <h2 className="text-xl font-heading font-bold mb-2">Create Your Own Prediction Market</h2>
            <p className="text-white/90">Launch a new market based on any social media metric or event.</p>
          </div>
          <button 
            className="bg-white text-violet-600 py-3 px-6 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-shadow whitespace-nowrap" 
            onClick={handleCreateMarketClick}
          >
            Create Market
          </button>
        </div>
      </div>

      {showCreateModal && (
        <CreateMarketModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
};

export default CreateMarketBanner;
