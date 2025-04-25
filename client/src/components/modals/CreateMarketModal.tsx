import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWalletAdapter } from "@/lib/WalletAdapter";

interface CreateMarketModalProps {
  onClose: () => void;
}

const CreateMarketModal: React.FC<CreateMarketModalProps> = ({ onClose }) => {
  const walletAdapter = useWalletAdapter();

  const handleCreateMarket = async () => {
    try {
      await walletAdapter.createPredictionMarket();
      onClose();
    } catch (error) {
      console.error("Failed to create market:", error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-text">
            Create Prediction Market
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-secondary">
            This will create a new prediction market with predefined parameters.
          </p>
          
          <div className="flex items-center justify-end gap-4 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border border-secondary text-text hover:bg-secondary hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateMarket}
              className="bg-primary hover:bg-accent text-white"
            >
              Create Market
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMarketModal;
