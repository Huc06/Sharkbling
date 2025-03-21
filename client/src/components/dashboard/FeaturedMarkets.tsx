import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Market } from "@shared/schema";
import { useMarkets } from "@/contexts/MarketsContext";
import BettingModal from "../modals/BettingModal";
import { useWallet } from "@/contexts/WalletContext";
import ConnectWalletModal from "../modals/ConnectWalletModal";

const FeaturedMarkets = () => {
  const { data: markets, isLoading } = useQuery<Market[]>({
    queryKey: ['/api/markets'],
  });
  
  const { setSelectedMarket } = useMarkets();
  const [showBettingModal, setShowBettingModal] = useState(false);
  const [selectedBetMarket, setSelectedBetMarket] = useState<Market | null>(null);
  const [selectedBetType, setSelectedBetType] = useState<"yes" | "no">("yes");
  const { isConnected } = useWallet();
  const [showConnectModal, setShowConnectModal] = useState(false);

  const handlePlaceBet = (market: Market, betType: "yes" | "no") => {
    if (!isConnected) {
      setShowConnectModal(true);
      return;
    }
    
    setSelectedBetMarket(market);
    setSelectedBetType(betType);
    setShowBettingModal(true);
  };

  // Function to format relative time (e.g., "12 days")
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
          <h2 className="text-xl font-heading font-bold text-slate-900">Featured Markets</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-5 animate-pulse">
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
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold text-slate-900">Featured Markets</h2>
          <a href="#" className="text-primary-500 text-sm font-medium flex items-center gap-1">
            View All <i className="fas fa-arrow-right text-xs"></i>
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {markets?.slice(0, 3).map((market) => {
            const { bgColor, icon } = getPlatformStyle(market.platform);
            const yesPercentage = (market.yesPool / (market.yesPool + market.noPool)) * 100;
            const noPercentage = 100 - yesPercentage;
            
            // Set button colors based on platform
            let buttonBgColor = "bg-primary-500 hover:bg-primary-600";
            if (market.platform === "LinkedIn") buttonBgColor = "bg-blue-500 hover:bg-blue-600";
            if (market.platform === "Farcaster") buttonBgColor = "bg-purple-500 hover:bg-purple-600";
            
            return (
              <div key={market.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`${bgColor} text-white p-1.5 rounded text-xs`}>
                      <i className={icon}></i>
                    </div>
                    <span className="text-xs font-medium text-slate-500">{market.platform}</span>
                    <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  
                  <h3 className="text-slate-900 font-medium mb-2">{market.title}</h3>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <i className="far fa-clock"></i>
                    <span>Ends in {formatTimeLeft(market.endDate)}</span>
                    <span className="inline-block h-1 w-1 bg-slate-400 rounded-full mx-1"></span>
                    <span>${market.initialPool.toLocaleString()} pool</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Yes ({yesPercentage.toFixed(0)}%)</span>
                      <span>No ({noPercentage.toFixed(0)}%)</span>
                    </div>
                    <div className="bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`${bgColor} h-full rounded-full`} 
                        style={{ width: `${yesPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      className={`${buttonBgColor} text-white py-2 rounded-lg text-sm font-medium`}
                      onClick={() => handlePlaceBet(market, "yes")}
                    >
                      Predict Yes
                    </button>
                    <button 
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 rounded-lg text-sm font-medium"
                      onClick={() => handlePlaceBet(market, "no")}
                    >
                      Predict No
                    </button>
                  </div>
                </div>
                
                <div className="border-t border-slate-200 px-5 py-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-slate-500">
                    <i className="fas fa-users"></i>
                    <span>{Math.floor(Math.random() * 300) + 50} participants</span>
                  </div>
                  <a 
                    href="#" 
                    className={`text-${market.platform === "GitHub" ? "primary" : market.platform === "LinkedIn" ? "blue" : "purple"}-500 font-medium`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedMarket(market);
                    }}
                  >
                    View Details
                  </a>
                </div>
              </div>
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
        <ConnectWalletModal onClose={() => setShowConnectModal(false)} />
      )}
    </>
  );
};

export default FeaturedMarkets;
