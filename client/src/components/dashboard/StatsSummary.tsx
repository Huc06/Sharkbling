import { useQuery } from "@tanstack/react-query";

const StatsSummary = () => {
  const { data: markets } = useQuery({
    queryKey: ['/api/markets'],
  });
  
  const activeMarkets = markets?.filter(m => m.status === 'active').length || 0;
  const totalVolume = markets ? markets.reduce((sum, market) => sum + market.initialPool, 0) / 1000 : 0;
  const totalRewards = totalVolume * 0.75; // 75% of volume goes to rewards for display purpose

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm">Active Markets</p>
            <p className="text-2xl font-bold text-slate-900">{activeMarkets}</p>
          </div>
          <div className="bg-primary-50 p-3 rounded-lg text-primary-500">
            <i className="fas fa-chart-bar"></i>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm">Total Trading Volume</p>
            <p className="text-2xl font-bold text-slate-900">{totalVolume.toFixed(2)}K SUI</p>
          </div>
          <div className="bg-secondary-500 bg-opacity-10 p-3 rounded-lg text-secondary-500">
            <i className="fas fa-coins"></i>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm">Your Prediction Score</p>
            <p className="text-2xl font-bold text-slate-900">--</p>
          </div>
          <div className="bg-accent-500 bg-opacity-10 p-3 rounded-lg text-accent-500">
            <i className="fas fa-trophy"></i>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm">Total Rewards Available</p>
            <p className="text-2xl font-bold text-slate-900">{totalRewards.toFixed(0)} SUI</p>
          </div>
          <div className="bg-yellow-500 bg-opacity-10 p-3 rounded-lg text-yellow-500">
            <i className="fas fa-award"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;
