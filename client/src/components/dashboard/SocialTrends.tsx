import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SocialTrend } from "@shared/schema";
import CreateMarketModal from "../modals/CreateMarketModal";
import { useWallet } from "@/contexts/WalletContext";
import ConnectWalletModal from "../modals/ConnectWalletModal";

const SocialTrends = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All Platforms");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState<SocialTrend | null>(null);
  const { isConnected } = useWallet();
  const [showConnectModal, setShowConnectModal] = useState(false);

  const { data: trends, isLoading } = useQuery<SocialTrend[]>({
    queryKey: ['/api/social-trends'],
  });

  const filteredTrends = selectedPlatform === "All Platforms" 
    ? trends 
    : trends?.filter(trend => trend.platform === selectedPlatform);

  const handleCreateMarketFromTrend = (trend: SocialTrend) => {
    if (!isConnected) {
      setShowConnectModal(true);
      return;
    }
    
    setSelectedTrend(trend);
    setShowCreateModal(true);
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const pastDate = new Date(timestamp);
    const diffMs = now.getTime() - pastDate.getTime();
    const diffHrs = Math.round(diffMs / (1000 * 60 * 60));
    
    if (diffHrs === 0) return "just now";
    if (diffHrs === 1) return "1 hour ago";
    return `${diffHrs} hours ago`;
  };

  const getMetricsForPlatform = (platform: string, metricsJson: string) => {
    const metrics = JSON.parse(metricsJson);
    
    switch (platform) {
      case "LinkedIn":
        return (
          <>
            <span className="flex items-center gap-1">
              <i className="far fa-thumbs-up"></i> {metrics.likes}
            </span>
            <span className="flex items-center gap-1">
              <i className="far fa-comment"></i> {metrics.comments}
            </span>
          </>
        );
      case "GitHub":
        return (
          <>
            <span className="flex items-center gap-1">
              <i className="fas fa-code-branch"></i> {metrics.forks}
            </span>
            <span className="flex items-center gap-1">
              <i className="far fa-star"></i> {metrics.stars}
            </span>
          </>
        );
      case "Farcaster":
        return (
          <>
            <span className="flex items-center gap-1">
              <i className="fas fa-retweet"></i> {metrics.recasts}
            </span>
            <span className="flex items-center gap-1">
              <i className="far fa-heart"></i> {metrics.likes}
            </span>
          </>
        );
      default:
        return null;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "LinkedIn":
        return <i className="fab fa-linkedin text-blue-500"></i>;
      case "GitHub":
        return <i className="fab fa-github text-slate-800"></i>;
      case "Farcaster":
        return <i className="fas fa-hashtag text-purple-500"></i>;
      case "Discord":
        return <i className="fab fa-discord text-indigo-500"></i>;
      default:
        return <i className="fas fa-globe"></i>;
    }
  };

  const getPlatformBgColor = (platform: string) => {
    switch (platform) {
      case "LinkedIn":
        return "bg-blue-100";
      case "GitHub":
        return "bg-slate-100";
      case "Farcaster":
        return "bg-purple-100";
      case "Discord":
        return "bg-indigo-100";
      default:
        return "bg-gray-100";
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-7 bg-slate-200 rounded w-1/4"></div>
          <div className="h-10 bg-slate-200 rounded w-40"></div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 pb-5 border-b border-slate-100">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-4 bg-slate-200 rounded w-16"></div>
                    <div className="h-3 bg-slate-200 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="flex items-center gap-4">
                    <div className="h-3 bg-slate-200 rounded w-12"></div>
                    <div className="h-3 bg-slate-200 rounded w-12"></div>
                    <div className="ml-auto h-4 bg-slate-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold text-slate-900">Social Trends</h2>
          <div className="flex items-center gap-2">
            <select 
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white"
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
            >
              <option>All Platforms</option>
              <option>GitHub</option>
              <option>LinkedIn</option>
              <option>Farcaster</option>
              <option>Discord</option>
            </select>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 space-y-5">
            {filteredTrends?.map((trend, index) => (
              <div 
                key={trend.id} 
                className={`flex gap-4 ${index < filteredTrends.length - 1 ? 'pb-5 border-b border-slate-100' : ''}`}
              >
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 ${getPlatformBgColor(trend.platform)} rounded-full flex items-center justify-center`}>
                    {getPlatformIcon(trend.platform)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{trend.platform}</span>
                    <span className="text-xs text-slate-500">{formatTimeAgo(trend.timestamp)}</span>
                  </div>
                  <p className="text-sm text-slate-800 mb-2">{trend.content}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    {getMetricsForPlatform(trend.platform, trend.metrics)}
                    <button 
                      className="ml-auto text-primary-500 font-medium text-xs"
                      onClick={() => handleCreateMarketFromTrend(trend)}
                    >
                      Create Market
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-slate-200 p-3 text-center">
            <button className="text-primary-500 text-sm font-medium">Load More Trends</button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && selectedTrend && (
        <CreateMarketModal 
          initialData={{
            platform: selectedTrend.platform,
            contentUrl: selectedTrend.contentUrl,
            title: `Will this ${selectedTrend.platform} post reach significant engagement?`
          }}
          onClose={() => setShowCreateModal(false)} 
        />
      )}

      {showConnectModal && (
        <ConnectWalletModal onClose={() => setShowConnectModal(false)} />
      )}
    </>
  );
};

export default SocialTrends;
