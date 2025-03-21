import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMarkets } from "@/contexts/MarketsContext";
import { Market } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast"; // Corrected import path


interface BettingModalProps {
  market: Market;
  initialBetType: "yes" | "no";
  onClose: () => void;
}

const BettingModal = ({ market, initialBetType, onClose }: BettingModalProps) => {
  const [selectedPrediction, setSelectedPrediction] = useState<"yes" | "no">(initialBetType);
  const [amount, setAmount] = useState<number>(0);
  const { placeBet, isPlacingBet } = useMarkets();

  const totalPool = market.yesPool + market.noPool;
  const yesOdds = totalPool / market.yesPool;
  const noOdds = totalPool / market.noPool;

  const calculatePayout = () => {
    if (amount <= 0) return 0;
    const odds = selectedPrediction === "yes" ? yesOdds : noOdds;
    return amount * odds;
  };

  const calculateFee = () => {
    const payout = calculatePayout();
    return payout * (market.marketFee / 100);
  };

  const formatTimeLeft = (endDate: Date) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day";
    return `${diffDays} days`;
  };

  const handlePlaceBet = async () => {
    if (amount <= 0) return;

    const result = await placeBet(market.id, selectedPrediction, amount);
    if (result) {
      const explorerUrl = getExplorerUrl(result.transactionDigest);
      toast({
        title: "Dự đoán thành công",
        description: (
          <div>
            Dự đoán của bạn đã được ghi nhận
            <a 
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer" 
              className="block mt-2 text-blue-600 hover:underline"
            >
              Xem giao dịch trên Sui Explorer
            </a>
          </div>
        ),
      });
      onClose();
    }
  };

  const getExplorerUrl = (transactionDigest: string) => {
    // Replace with actual Sui Explorer URL construction
    return `https://sui-explorer.com/tx/${transactionDigest}`; 
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-heading font-bold">Place Prediction</DialogTitle>
        </DialogHeader>

        <div className="mb-6">
          <div className="mb-4">
            <h4 className="font-medium text-slate-800 mb-1">{market.title}</h4>
            <div className="text-sm text-slate-500">Market ends in {formatTimeLeft(market.endDate)}</div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className={`flex-1 border ${selectedPrediction === "yes" ? "border-primary-200 bg-primary-50" : "border-slate-200"} rounded-lg p-3`}>
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Current Yes Odds</div>
                <div className={`text-xl font-bold ${selectedPrediction === "yes" ? "text-primary-600" : "text-slate-800"}`}>
                  {yesOdds.toFixed(2)}x
                </div>
              </div>
            </div>

            <div className={`flex-1 border ${selectedPrediction === "no" ? "border-primary-200 bg-primary-50" : "border-slate-200"} rounded-lg p-3`}>
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Current No Odds</div>
                <div className={`text-xl font-bold ${selectedPrediction === "no" ? "text-primary-600" : "text-slate-800"}`}>
                  {noOdds.toFixed(2)}x
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your Prediction</label>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  className={selectedPrediction === "yes" ? "bg-primary-500" : "bg-slate-100 text-slate-800 hover:text-white"}
                  onClick={() => setSelectedPrediction("yes")}
                >
                  Yes
                </Button>
                <Button 
                  className={selectedPrediction === "no" ? "bg-primary-500" : "bg-slate-100 text-slate-800 hover:text-white"}
                  onClick={() => setSelectedPrediction("no")}
                >
                  No
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount (SUI)</label>
              <div className="relative">
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  min={0}
                  value={amount || ""}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="pr-16"
                />
                <button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-slate-100 px-2 py-1 rounded text-slate-600"
                  onClick={() => setAmount(100)} // Set a sample MAX value
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Potential Payout:</span>
                <span className="font-medium">{calculatePayout().toFixed(2)} SUI</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-slate-600">Fee ({market.marketFee}%):</span>
                <span className="font-medium">{calculateFee().toFixed(2)} SUI</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md"
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