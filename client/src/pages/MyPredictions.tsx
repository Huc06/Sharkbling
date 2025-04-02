import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TopBar from "@/components/layout/TopBar";
import MobileNavigation from "@/components/layout/MobileNavigation";
import { Market, Prediction } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSuiWallet } from "@/hooks/useSuiWallet";
import SuiWalletModal from "@/components/modals/SuiWalletModal";

const MyPredictions = () => {
  const { walletAddress, isConnected, openConnectWalletModal } = useSuiWallet();
  const [showConnectModal, setShowConnectModal] = useState(false);

  // Fetch user's predictions
  const { data: predictions, isLoading: predictionsLoading } = useQuery<Prediction[]>({
    queryKey: ['/api/predictions', { walletAddress }],
    enabled: !!walletAddress && isConnected,
  });

  // Fetch all markets to get details for predictions
  const { data: markets, isLoading: marketsLoading } = useQuery<Market[]>({
    queryKey: ['/api/markets'],
  });

  // Group predictions by status
  const activePredictions = predictions?.filter(prediction => {
    const market = markets?.find(m => m.id === prediction.marketId);
    return market?.status === 'active';
  });

  const completedPredictions = predictions?.filter(prediction => {
    const market = markets?.find(m => m.id === prediction.marketId);
    return market?.status === 'resolved';
  });

  const pendingResolution = predictions?.filter(prediction => {
    const market = markets?.find(m => m.id === prediction.marketId);
    return market?.status === 'ended';
  });

  const isLoading = predictionsLoading || marketsLoading;

  // Function to format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  if (!isConnected) {
    return (
      <div className="flex flex-col min-h-screen lg:flex-row">
        {/* <Sidebar /> */}
        <main className="flex-1 lg:ml-64">
          <TopBar />
          <div className="pt-16 pb-16 lg:pb-0">
            <div className="p-4 sm:p-6 md:p-8">
              <h1 className="text-2xl font-heading font-bold text-slate-900 mb-6">My Predictions</h1>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                <div className="mx-auto w-16 h-16 flex items-center justify-center bg-slate-100 rounded-full mb-4">
                  <i className="fas fa-wallet text-slate-400 text-xl"></i>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Connect Your Wallet</h3>
                <p className="text-slate-600 mb-4">
                  Please connect your Sui wallet to view your predictions.
                </p>
                <Button 
                  className="bg-primary-500 hover:bg-primary-600"
                  onClick={() => openConnectWalletModal()}
                >
                  Connect Wallet
                </Button>
              </div>
            </div>
          </div>
          <MobileNavigation />
        </main>

        {showConnectModal && (
          <SuiWalletModal open={showConnectModal} onClose={() => setShowConnectModal(false)} />
        )}
      </div>
    );
  }

  const renderPredictionItem = (prediction: Prediction) => {
    const market = markets?.find(m => m.id === prediction.marketId);
    if (!market) return null;

    const { bgColor, icon } = getPlatformStyle(market.platform);
    
    // Calculate potential winnings
    const potentialWinnings = prediction.amount * prediction.odds;
    
    // Check if prediction matches result
    const isPredictionCorrect = market.status === 'resolved' && 
                               ((prediction.prediction === 'yes' && market.result === 'yes') || 
                                (prediction.prediction === 'no' && market.result === 'no'));

    return (
      <div key={prediction.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-4">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className={`${bgColor} text-white p-1.5 rounded text-xs`}>
              <i className={icon}></i>
            </div>
            <span className="text-xs font-medium text-slate-500">{market.platform}</span>
            <span className={`ml-auto ${market.status === 'active' ? 'bg-green-100 text-green-800' : market.status === 'ended' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'} text-xs px-2 py-0.5 rounded-full`}>
              {market.status.charAt(0).toUpperCase() + market.status.slice(1)}
            </span>
          </div>
          
          <h3 className="text-slate-900 font-medium mb-2">{market.title}</h3>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <i className="far fa-calendar"></i>
              <span>Ends: {formatDate(market.endDate)}</span>
            </div>
            <div className={`inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full ${prediction.prediction === 'yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              <i className={`fas ${prediction.prediction === 'yes' ? 'fa-check' : 'fa-times'}`}></i>
              <span>Predicted: {prediction.prediction.toUpperCase()}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-xs text-slate-500 mb-1">Your Stake</div>
              <div className="font-medium">{prediction.amount.toFixed(2)} SUI</div>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-xs text-slate-500 mb-1">Odds</div>
              <div className="font-medium">{prediction.odds.toFixed(2)}x</div>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-xs text-slate-500 mb-1">Potential Payout</div>
              <div className="font-medium">{potentialWinnings.toFixed(2)} SUI</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-200 px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-sm text-slate-500">
            Placed on: {formatDate(prediction.createdAt)}
          </div>
          
          {market.status === 'resolved' && (
            <div className="flex items-center">
              {isPredictionCorrect ? (
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-medium text-sm">
                    <i className="fas fa-trophy mr-1"></i> You won!
                  </span>
                  {!prediction.claimed && (
                    <Button size="sm" className="h-8 bg-green-500 hover:bg-green-600">
                      Claim Reward
                    </Button>
                  )}
                </div>
              ) : (
                <span className="text-red-500 font-medium text-sm">
                  <i className="fas fa-times-circle mr-1"></i> Incorrect prediction
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen lg:flex-row">
      {/* <Sidebar /> */}
      <main className="flex-1 lg:ml-64">
        <TopBar />
        <div className="pt-16 pb-16 lg:pb-0">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-heading font-bold text-slate-900">My Predictions</h1>
              <div className="text-sm text-slate-600">
                Wallet: {walletAddress?.substring(0, 6)}...{walletAddress?.substring(walletAddress.length - 4)}
              </div>
            </div>
            
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="mb-6 grid grid-cols-3">
                <TabsTrigger value="active">Active ({activePredictions?.length || 0})</TabsTrigger>
                <TabsTrigger value="pending">Pending Resolution ({pendingResolution?.length || 0})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedPredictions?.length || 0})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active">
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                        <div className="h-4 bg-slate-200 rounded w-1/4 mb-3"></div>
                        <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div className="grid grid-cols-3 gap-4 mb-2">
                          <div className="h-16 bg-slate-200 rounded"></div>
                          <div className="h-16 bg-slate-200 rounded"></div>
                          <div className="h-16 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activePredictions && activePredictions.length > 0 ? (
                  <div className="space-y-4">
                    {activePredictions.map(prediction => renderPredictionItem(prediction))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center bg-slate-100 rounded-full mb-4">
                      <i className="fas fa-search text-slate-400 text-xl"></i>
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No active predictions</h3>
                    <p className="text-slate-600 mb-4">
                      You haven't placed any predictions on active markets yet.
                    </p>
                    <Button 
                      className="bg-primary-500 hover:bg-primary-600"
                      onClick={() => window.location.href = "/markets"}
                    >
                      Browse Markets
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="pending">
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                        <div className="h-4 bg-slate-200 rounded w-1/4 mb-3"></div>
                        <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div className="grid grid-cols-3 gap-4 mb-2">
                          <div className="h-16 bg-slate-200 rounded"></div>
                          <div className="h-16 bg-slate-200 rounded"></div>
                          <div className="h-16 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : pendingResolution && pendingResolution.length > 0 ? (
                  <div className="space-y-4">
                    {pendingResolution.map(prediction => renderPredictionItem(prediction))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center bg-slate-100 rounded-full mb-4">
                      <i className="fas fa-hourglass-half text-slate-400 text-xl"></i>
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No pending predictions</h3>
                    <p className="text-slate-600 mb-4">
                      You don't have any predictions waiting for resolution.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed">
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                        <div className="h-4 bg-slate-200 rounded w-1/4 mb-3"></div>
                        <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div className="grid grid-cols-3 gap-4 mb-2">
                          <div className="h-16 bg-slate-200 rounded"></div>
                          <div className="h-16 bg-slate-200 rounded"></div>
                          <div className="h-16 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : completedPredictions && completedPredictions.length > 0 ? (
                  <div className="space-y-4">
                    {completedPredictions.map(prediction => renderPredictionItem(prediction))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center bg-slate-100 rounded-full mb-4">
                      <i className="fas fa-history text-slate-400 text-xl"></i>
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No completed predictions</h3>
                    <p className="text-slate-600 mb-4">
                      You don't have any completed predictions yet.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <MobileNavigation />
      </main>
    </div>
  );
};

export default MyPredictions;
