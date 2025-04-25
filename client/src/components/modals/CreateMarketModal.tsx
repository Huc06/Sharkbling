import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWalletAdapter } from "@/lib/WalletAdapter";

interface MarketFormData {
  title: string;
  description: string;
  resolutionTime: string;
  minAmount: string;
  coinObjectId: string;
}

interface CreateMarketModalProps {
  onClose: () => void;
}

const CreateMarketModal: React.FC<CreateMarketModalProps> = ({ onClose }) => {
  const walletAdapter = useWalletAdapter();
  const { register, handleSubmit, formState: { errors } } = useForm<MarketFormData>();

  const onSubmit = async (data: MarketFormData) => {
    try {
      const timestamp = Math.floor(new Date(data.resolutionTime).getTime() / 1000);
      await walletAdapter.createPredictionMarket({
        title: data.title,
        description: data.description,
        resolutionTime: timestamp,
        minAmount: parseInt(data.minAmount),
        coinObjectId: data.coinObjectId,
      });
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              className="w-full"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              {...register("description", { required: "Description is required" })}
              className="w-full"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="resolutionTime">Resolution Time</Label>
            <Input
              id="resolutionTime"
              type="datetime-local"
              {...register("resolutionTime", { required: "Resolution time is required" })}
              className="w-full"
            />
            {errors.resolutionTime && <p className="text-red-500 text-sm">{errors.resolutionTime.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="minAmount">Minimum Amount</Label>
            <Input
              id="minAmount"
              type="number"
              {...register("minAmount", { 
                required: "Minimum amount is required",
                min: { value: 1, message: "Amount must be greater than 0" }
              })}
              className="w-full"
            />
            {errors.minAmount && <p className="text-red-500 text-sm">{errors.minAmount.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coinObjectId">Coin Object ID</Label>
            <Input
              id="coinObjectId"
              {...register("coinObjectId", { 
                required: "Coin Object ID is required",
                pattern: {
                  value: /^0x[a-fA-F0-9]+$/,
                  message: "Invalid Sui object ID format"
                }
              })}
              defaultValue="0x852d1d6340775421f833ffcabf36a0dcb775f11fd2b56efa26512421aadef0ee"
              className="w-full font-mono"
            />
            {errors.coinObjectId && <p className="text-red-500 text-sm">{errors.coinObjectId.message}</p>}
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border border-secondary text-text hover:bg-secondary hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-accent text-white"
            >
              Create Market
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMarketModal;
