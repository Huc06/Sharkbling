import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Market } from "@shared/schema";
import { useMarkets } from "@/contexts/MarketsContext";
import BettingModal from "../modals/BettingModal";
import { useSuiWallet } from "@/hooks/useSuiWallet";
import SuiWalletModal from "../modals/SuiWalletModal";
import FeatureMarketCard from "../FeatureMarketsCard/FeatureMarketsCard";
import { Link } from "wouter";
const FeaturedMarkets = () => {
  const { data: markets, isLoading } = useQuery<Market[]>({
    queryKey: ["/api/markets"],
  });

  const { setSelectedMarket } = useMarkets();
  const [showBettingModal, setShowBettingModal] = useState(false);
  const [selectedBetMarket, setSelectedBetMarket] = useState<Market | null>(
    null
  );
  const [selectedBetType, setSelectedBetType] = useState<"yes" | "no">("yes");
  const { isConnected, openConnectWalletModal } = useSuiWallet();
  const [showConnectModal, setShowConnectModal] = useState(false);

  const handlePlaceBet = (market: Market, betType: "yes" | "no") => {
    if (!isConnected) {
      openConnectWalletModal();
      return;
    }

    setSelectedBetMarket(market);
    setSelectedBetType(betType);
    setShowBettingModal(true);
  };

  const formatTimeLeft = (endDate: Date) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day";
    return `${diffDays} days`;
  };

  // Get platform-specific styling
  const getPlatformStyle = (platform: string) => {
    switch (platform) {
      case "GitHub":
        return { bgColor: "bg-primary-500", icon: "fab fa-github" };
      case "LinkedIn":
        return { bgColor: "bg-blue-500", icon: "fab fa-linkedin" };
      case "Farcaster":
        return { bgColor: "bg-purple-500", icon: "fas fa-hashtag" };
      case "Discord":
        return { bgColor: "bg-indigo-500", icon: "fab fa-discord" };
      default:
        return { bgColor: "bg-gray-500", icon: "fas fa-globe" };
    }
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-heading font-bold text-slate-900">
            Featured Markets
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-5 animate-pulse"
            >
              <div className="h-4 bg-slate-200 rounded w-1/4 mb-3"></div>
              <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
              <div className="h-2 bg-slate-200 rounded w-full mb-4"></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-10 bg-slate-200 rounded"></div>
                <div className="h-10 bg-slate-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold text-slate-900">
            Featured Markets
          </h2>
          <Link
            to="/markets" // Sử dụng Link để điều hướng đến trang markets
            className="text-primary-500 text-sm font-medium flex items-center gap-1"
          >
            View All <i className="fas fa-arrow-right text-xs"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
          {markets?.slice(0, 4).map((market) => {
            const yesPercentage =
              (market.yesPool / (market.yesPool + market.noPool)) * 100 || 0;
            const { bgColor, icon } = getPlatformStyle(market.platform);
            const buttonBgColor = getButtonColor(market.platform);

            return (
              <FeatureMarketCard
                key={market.id}
                market={market}
                yesPercentage={yesPercentage}
                noPercentage={100 - yesPercentage}
                // bgColor={bgColor}
                // buttonBgColor={buttonBgColor}
                onPlaceBet={(betType) => handlePlaceBet(market, betType)}
                onViewDetails={(e) => {
                  e.preventDefault();
                  setSelectedMarket(market);
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {showBettingModal && selectedBetMarket && (
        <BettingModal
          market={selectedBetMarket}
          initialBetType={selectedBetType}
          onClose={() => setShowBettingModal(false)}
        />
      )}

      {showConnectModal && (
        <SuiWalletModal
          open={showConnectModal}
          onClose={() => setShowConnectModal(false)}
        />
      )}
    </>
  );
};

// Helper function
const getButtonColor = (platform: string) => {
  switch (platform) {
    case "GitHub":
      return "bg-primary-500 hover:bg-primary-600";
    case "LinkedIn":
      return "bg-blue-500 hover:bg-blue-600";
    case "X":
      return "bg-purple-500 hover:bg-purple-600";
    case "Farcaster":
      return "bg-purple-500 hover:bg-purple-600";
    default:
      return "bg-primary-500 hover:bg-primary-600";
  }
};

export default FeaturedMarkets;
