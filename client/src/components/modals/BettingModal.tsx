import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMarkets } from "@/contexts/MarketsContext";
import { Market } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useWalletAdapter } from "@/lib/WalletAdapter";

interface BettingModalProps {
  market: Market;
  initialBetType: "yes" | "no";
  onClose: () => void;
}

const BettingModal = ({
  market,
  initialBetType,
  onClose,
}: BettingModalProps) => {
  const [selectedPrediction, setSelectedPrediction] = useState<"yes" | "no">(
    initialBetType
  );
  const [amount, setAmount] = useState<number>(0);
  const [marketId, setMarketId] = useState<string>("");
  const { placeBet, isPlacingBet } = useMarkets();
  const { placePrediction, txResult, isConnected } = useWalletAdapter();

  const totalPool = market.yesPool + market.noPool;
  const yesOdds = totalPool / market.yesPool;
  const noOdds = totalPool / market.noPool;

  const calculatePayout = () =>
    amount > 0 ? amount * (selectedPrediction === "yes" ? yesOdds : noOdds) : 0;
  const calculateFee = () => calculatePayout() * (market.marketFee / 100);

  const validateInput = () => {
    if (!isConnected) {
      toast({
        title: "Lỗi",
        description: "Vui lòng kết nối ví trước khi đặt cược",
        variant: "destructive",
      });
      return false;
    }

    // Validate Market ID format
    if (!marketId.startsWith('0x') || marketId.length !== 66) {
      toast({
        title: "Lỗi",
        description: "Market ID không hợp lệ. ID phải bắt đầu bằng 0x và có độ dài 66 ký tự",
        variant: "destructive",
      });
      return false;
    }

    if (!amount || amount <= 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số tiền cược hợp lệ",
        variant: "destructive",
      });
      return false;
    }

    if (amount < market.minAmount) {
      toast({
        title: "Lỗi",
        description: `Số tiền cược phải lớn hơn hoặc bằng ${market.minAmount} SUI`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handlePlaceBet = async () => {
    if (!validateInput()) return;

    try {
      // Use actual market ID from props or state
      const result = await placePrediction(
        marketId,
        selectedPrediction === "yes",
        amount
      );

      if (result) {
        toast({
          title: "Dự đoán thành công",
          description: (
            <a
              href={`https://sui-explorer.com/tx/${result.digest}`}
              target="_blank"
              className="text-primary hover:underline"
            >
              Xem giao dịch
            </a>
          ),
        });
        onClose();
      }
    } catch (error) {
      console.error("Betting error details:", error);
      toast({
        title: "Lỗi",
        description:
          error instanceof Error
            ? `Đặt cược thất bại: ${error.message}`
            : "Đặt cược thất bại. Vui lòng kiểm tra console để xem chi tiết.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6 theme-primary-bg rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text">
            Place Prediction
          </DialogTitle>
        </DialogHeader>

        <div className="mb-6 space-y-4">
          <h4 className="font-medium text-[var(--color-text)]">
            {market.title}
          </h4>
          <div className="text-sm text-[var(--color-secondary)]">
            Market ends in {new Date(market.endDate).toLocaleDateString()}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              className={`${
                selectedPrediction === "yes"
                  ? " button-betting-cus theme-secondary text-white border border-2"
                  : "theme-primary-bg  border border-2"
              } `}
              onClick={() => setSelectedPrediction("yes")}
            >
              Yes ({yesOdds.toFixed(2)}x)
            </Button>
            <Button
              className={`${
                selectedPrediction === "no"
                  ? " button-betting-cus theme-secondary  text-white border border-2"
                  : "theme-primary-bg border border-2"
              } `}
              onClick={() => setSelectedPrediction("no")}
            >
              No ({noOdds.toFixed(2)}x)
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Market ID
            </label>
            <Input
              type="text"
              placeholder="Enter market ID"
              value={marketId}
              onChange={(e) => setMarketId(e.target.value)}
              className="w-full p-2 border rounded-md text-[var(--color-text)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Amount (SUI) - Minimum: {market.minAmount} SUI
            </label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                min={market.minAmount}
                value={amount || ""}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className={`w-full p-2 border rounded-md text-[var(--color-text)] ${
                  amount < market.minAmount ? "border-red-500" : ""
                }`}
              />
              {amount < market.minAmount && (
                <p className="text-red-500 text-sm mt-1">
                  Amount must be at least {market.minAmount} SUI
                </p>
              )}
            </div>
          </div>

          <div className="bg-[var(--color-secondary)] p-3 rounded-md text-sm text-[var(--color-white)]">
            <div className="flex justify-between">
              <span>Potential Payout:</span>
              <span className="font-medium">
                {calculatePayout().toFixed(2)} SUI
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Fee ({market.marketFee}%):</span>
              <span className="font-medium">
                {calculateFee().toFixed(2)} SUI
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-white)]"
          >
            Cancel
          </Button>
          <Button
            className="bg-[var(--color-secondary)] hover:bg-[var(--color-text)] text-[var(--color-white)] px-6 py-2 rounded-lg shadow-md"
            onClick={handlePlaceBet}
            disabled={isPlacingBet || amount <= 0}
          >
            {isPlacingBet ? "Processing..." : "Confirm Prediction"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BettingModal;
