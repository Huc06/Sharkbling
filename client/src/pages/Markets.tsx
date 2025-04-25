import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import TopBar from "@/components/layout/TopBar";
import MobileNavigation from "@/components/layout/MobileNavigation";
import { Market } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import CreateMarketModal from "@/components/modals/CreateMarketModal";
import BettingModal from "@/components/modals/BettingModal";
import { useSuiWallet } from "@/hooks/useSuiWallet";
import SuiWalletModal from "@/components/modals/SuiWalletModal";
import FeatureMarketCard from "@/components/FeatureMarketsCard/FeatureMarketsCard";

const Markets = () => {
  const queryClient = useQueryClient();
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBettingModal, setShowBettingModal] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [selectedBetType, setSelectedBetType] = useState<"yes" | "no">("yes");
  const { isConnected, openConnectWalletModal } = useSuiWallet();
  const [showConnectModal, setShowConnectModal] = useState(false);

  const { data: markets, isLoading } = useQuery<Market[]>({
    queryKey: ["/api/markets"],
  });

  const handleMarketCreated = () => {
    setShowCreateModal(false);
    queryClient.invalidateQueries({ queryKey: ["/api/markets"] });
  };

  // Filter markets based on selected filters and search term
  const filteredMarkets = markets?.filter((market) => {
    const matchesPlatform =
      selectedPlatform === "All" || market.platform === selectedPlatform;
    const matchesStatus =
      selectedStatus === "All" ||
      market.status === selectedStatus.toLowerCase();
    const matchesSearch = market.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesPlatform && matchesStatus && matchesSearch;
  });

  const handlePlaceBet = (market: Market, betType: "yes" | "no") => {
    if (!isConnected) {
      openConnectWalletModal();
      return;
    }

    setSelectedMarket(market);
    setSelectedBetType(betType);
    setShowBettingModal(true);
  };

  // Function to format relative time
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
        return {
          bgColor: "bg-primary-500",
          icon: "fab fa-github",
          textColor: "text-primary-500",
        };
      case "LinkedIn":
        return {
          bgColor: "bg-blue-500",
          icon: "fab fa-linkedin",
          textColor: "text-blue-500",
        };
      case "Farcaster":
        return {
          bgColor: "bg-purple-500",
          icon: "fas fa-hashtag",
          textColor: "text-purple-500",
        };
      case "Discord":
        return {
          bgColor: "bg-indigo-500",
          icon: "fab fa-discord",
          textColor: "text-indigo-500",
        };
      default:
        return {
          bgColor: "bg-gray-500",
          icon: "fas fa-globe",
          textColor: "text-gray-500",
        };
    }
  };

  return (
    <div className="flex flex-col min-h-screen lg:flex-row">
      {/* Sidebar (desktop only) */}

      {/* Main content */}
      <main className="flex-1">
        {/* TopBar */}
        <TopBar />

        {/* Content area */}
        <div className="pt-16 pb-16 lg:pb-0">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2">
                  Prediction Markets
                </h1>
                <p className="text-slate-600">
                  Browse and participate in prediction markets across social
                  platforms.
                </p>
              </div>
              <Button
                className="bg-primary-500 hover:bg-primary-600 text-white"
                onClick={() =>
                  isConnected
                    ? setShowCreateModal(true)
                    : openConnectWalletModal()
                }
              >
                <i className="fas fa-plus mr-2"></i>
                Create New Market
              </Button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-slate-200">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search markets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="w-full md:w-48">
                  <Select
                    onValueChange={setSelectedPlatform}
                    defaultValue={selectedPlatform}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Platforms</SelectItem>
                      <SelectItem value="GitHub">GitHub</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Farcaster">Farcaster</SelectItem>
                      <SelectItem value="Discord">Discord</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-48">
                  <Select
                    onValueChange={setSelectedStatus}
                    defaultValue={selectedStatus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Ended">Ended</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 animate-pulse"
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
            ) : filteredMarkets && filteredMarkets.length > 0 ? (
              <div className="flex flex-wrap justify-center">
                {filteredMarkets.map((market) => {
                  const yesPercentage =
                    (market.yesPool / (market.yesPool + market.noPool)) * 100;
                  const noPercentage = 100 - yesPercentage;

                  return (
                    <div className="flex-none w-full md:w-1/3 lg:w-1/4 flex" key={market.id}>
                      <FeatureMarketCard
                        market={market}
                        yesPercentage={yesPercentage}
                        noPercentage={noPercentage}
                        onPlaceBet={(betType) => handlePlaceBet(market, betType)}
                        onViewDetails={(e) => {
                          e.preventDefault();
                          // View market details logic here
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                <div className="mx-auto w-16 h-16 flex items-center justify-center bg-slate-100 rounded-full mb-4">
                  <i className="fas fa-search text-slate-400 text-xl"></i>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No markets found
                </h3>
                <p className="text-slate-600 mb-4">
                  {searchTerm
                    ? "Try different search terms or filters"
                    : "No markets match the selected filters"}
                </p>
                <Button
                  className="bg-primary-500 hover:bg-primary-600"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedPlatform("All");
                    setSelectedStatus("All");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileNavigation />
      </main>

      {/* Modals */}
      {showCreateModal && (
        <CreateMarketModal 
          onClose={() => setShowCreateModal(false)} 
          onSuccess={handleMarketCreated}
        />
      )}

      {showBettingModal && selectedMarket && (
        <BettingModal
          market={selectedMarket}
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
    </div>
  );
};

export default Markets;
