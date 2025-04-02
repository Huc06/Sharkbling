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
  const { placeBet, isPlacingBet } = useMarkets();

  const totalPool = market.yesPool + market.noPool;
  const yesOdds = totalPool / market.yesPool;
  const noOdds = totalPool / market.noPool;

  const calculatePayout = () =>
    amount > 0 ? amount * (selectedPrediction === "yes" ? yesOdds : noOdds) : 0;
  const calculateFee = () => calculatePayout() * (market.marketFee / 100);

  const handlePlaceBet = async () => {
    if (amount <= 0) return;
    const result = await placeBet(market.id, selectedPrediction, amount);
    if (result) {
      toast({
        title: "Dự đoán thành công",
        description: (
          <a
            href={`https://sui-explorer.com/tx/${result.id}`}
            target="_blank"
            className="text-primary hover:underline"
          >
            Xem giao dịch
          </a>
        ),
      });
      onClose();
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
                selectedPrediction === "yes" ? " button-betting-cus theme-secondary text-white border border-2" : "theme-primary-bg  border border-2"
              } `}
              onClick={() => setSelectedPrediction("yes")}
            >
              Yes ({yesOdds.toFixed(2)}x)
            </Button>
            <Button
              className={`${
                selectedPrediction === "no" ? " button-betting-cus theme-secondary  text-white border border-2" : "theme-primary-bg border border-2"
              } `}
              onClick={() => setSelectedPrediction("no")}
            >
              No ({noOdds.toFixed(2)}x)
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Amount (SUI)
            </label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                min={0}
                value={amount || ""}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border rounded-md text-[var(--color-text)]"
              />
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
