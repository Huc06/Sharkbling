import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWalletAdapter } from "@/lib/WalletAdapter";
import { TransactionSuccessAlert } from "@/components/TransactionSuccessAlert";

interface MarketFormData {
  title: string;
  description: string;
  resolutionTime: string;
  minAmount: string;
}

interface CreateMarketModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: {
    title?: string;
    description?: string;
    resolutionTime?: string;
    minAmount?: string;
  };
}

const CreateMarketModal: React.FC<CreateMarketModalProps> = ({ onClose, onSuccess, initialData }) => {
  const walletAdapter = useWalletAdapter();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<MarketFormData>({
    defaultValues: initialData || {}
  });

  const [txDigest, setTxDigest] = React.useState<string | null>(null);

  // Theo dõi tất cả các giá trị form trong thời gian thực
  const formValues = watch();

  // Log giá trị form mỗi khi chúng thay đổi
  React.useEffect(() => {
    console.table(formValues); // Sử dụng console.table thay vì console.log
  }, [formValues]);

  // Lưu dữ liệu vào localStorage dưới dạng mảng
  const saveMarketData = (data: any) => {
    // Lấy dữ liệu hiện có
    const existingData = localStorage.getItem('marketFormDataList');
    let marketList = [];

    if (existingData) {
      marketList = JSON.parse(existingData);
    }

    // Thêm dữ liệu mới vào mảng
    marketList.push({
      ...data,
      id: Date.now(), // Thêm ID duy nhất
      createdAt: new Date().toISOString()
    });

    // Lưu lại vào localStorage
    localStorage.setItem('marketFormDataList', JSON.stringify(marketList));
  };

  const onSubmit = async (data: MarketFormData) => {
    try {
      const timestamp = Math.floor(new Date(data.resolutionTime).getTime() / 1000);
      const processedData = {
        title: data.title,
        description: data.description,
        resolutionTime: timestamp,
        minAmount: parseFloat(data.minAmount),
      };

      // Save to localStorage
      saveMarketData(processedData);

      // Execute transaction
      const result = await walletAdapter.createPredictionMarket(processedData);

      if (result?.digest) {
        setTxDigest(result.digest);
        // Remove auto-close timer
      }
    } catch (error) {
      console.error("Failed to create market:", error);
    }
  };

  const handleClose = () => {
    if (txDigest && onSuccess) {
      onSuccess();
    }
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-text">
            Create Prediction Market
          </DialogTitle>
        </DialogHeader>

        {/* Show transaction status */}
        {walletAdapter.txResult.loading && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded">
            Creating market...
          </div>
        )}

        {/* Show success alert with SuiVision link */}
        {txDigest && (
          <>
            <TransactionSuccessAlert 
              digest={txDigest}
              network={walletAdapter.network}
            />
            <Button
              onClick={handleClose}
              className="w-full mb-4 bg-green-600 hover:bg-green-700 text-white"
            >
              Close
            </Button>
          </>
        )}

        {/* Only show form if transaction is not successful */}
        {!txDigest && (
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
              <Label htmlFor="minAmount">Amount (SUI)</Label>
              <Input 
                id="minAmount"
                type="number"
                step="0.000000001"
                min="0"
                {...register("minAmount", { 
                  required: "Amount is required",
                  validate: value => parseFloat(value) > 0 || "Amount must be greater than 0"
                })}
                placeholder="Enter amount in SUI"
                className="w-full"
              />
              <div className="text-xs text-gray-500">
                Enter the amount in SUI (1 SUI = 1,000,000,000 MIST)
              </div>
              {errors.minAmount && <p className="text-red-500 text-sm">{errors.minAmount.message}</p>}
            </div>
            <div className="flex items-center justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border border-secondary text-text hover:bg-secondary hover:text-white"
                disabled={walletAdapter.txResult.loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-accent text-white"
                disabled={walletAdapter.txResult.loading}
              >
                {walletAdapter.txResult.loading ? "Creating..." : "Create Market"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateMarketModal;
