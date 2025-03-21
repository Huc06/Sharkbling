import { useWallet } from "@/contexts/WalletContext";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

const UserStats = () => {
  const { walletAddress, connectWallet, isConnected } = useWallet();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: [`/api/users/${walletAddress}`],
    enabled: !!walletAddress && isConnected,
  });

  if (!isConnected) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="border-b border-slate-200 p-5">
          <h3 className="font-medium text-slate-900">Your Stats</h3>
        </div>
        
        <div className="p-5">
          <div className="flex justify-center py-8 flex-col items-center">
            <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mb-3">
              <i className="fas fa-wallet text-xl text-slate-400"></i>
            </div>
            <p className="text-slate-500 text-sm mb-4 text-center">Connect your Sui Wallet to view your stats and participate in prediction markets</p>
            <button 
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
              onClick={connectWallet}
            >
              <i className="fas fa-wallet"></i>
              <span>Connect Wallet</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6 animate-pulse">
        <div className="border-b border-slate-200 p-5">
          <h3 className="font-medium text-slate-900">Your Stats</h3>
        </div>
        <div className="p-5 space-y-3">
          <div className="h-5 bg-slate-200 rounded w-1/2"></div>
          <div className="h-5 bg-slate-200 rounded w-3/4"></div>
          <div className="h-5 bg-slate-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="border-b border-slate-200 p-5">
          <h3 className="font-medium text-slate-900">Your Stats</h3>
        </div>
        <div className="p-5">
          <p className="text-slate-500 text-sm text-center py-4">No stats available yet. Start making predictions!</p>
        </div>
      </div>
    );
  }

  const accuracy = user.totalPredictions > 0 
    ? Math.round((user.correctPredictions / user.totalPredictions) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div className="border-b border-slate-200 p-5">
        <h3 className="font-medium text-slate-900">Your Stats</h3>
      </div>
      
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Prediction Score:</span>
          <span className="font-medium">{user.predictionScore}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Total Predictions:</span>
          <span className="font-medium">{user.totalPredictions}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Accuracy:</span>
          <span className="font-medium">{accuracy}%</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Wallet:</span>
          <span className="font-medium text-xs">
            {walletAddress?.substring(0, 6)}...{walletAddress?.substring(walletAddress.length - 4)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
