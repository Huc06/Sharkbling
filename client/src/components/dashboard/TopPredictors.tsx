import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

const TopPredictors = () => {
  const { data: predictors, isLoading } = useQuery<User[]>({
    queryKey: ['/api/top-predictors'],
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-pulse">
        <div className="border-b border-slate-200 p-5">
          <h3 className="font-medium text-slate-900">Top Predictors</h3>
        </div>
        
        <div className="p-5">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 bg-slate-200 rounded-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-20"></div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="border-b border-slate-200 p-5">
        <h3 className="font-medium text-slate-900">Top Predictors</h3>
      </div>
      
      <div className="p-5">
        <div className="space-y-4">
          {predictors?.map((predictor, index) => {
            // Badge styling based on ranking
            let badgeClass = "bg-slate-100 text-slate-800";
            if (index === 0) badgeClass = "bg-amber-100 text-amber-800";
            if (index === 1) badgeClass = "bg-slate-100 text-slate-800";
            if (index === 2) badgeClass = "bg-amber-800 bg-opacity-20 text-amber-800";
            
            return (
              <div key={predictor.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`${badgeClass} w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium`}>
                    {index + 1}
                  </div>
                  <div className="font-medium text-sm">{predictor.walletAddress}</div>
                </div>
                <div className="text-sm font-medium">{predictor.predictionScore}% accuracy</div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-100">
          <a href="#" className="text-primary-500 text-sm font-medium flex items-center justify-center gap-1">
            View Leaderboard <i className="fas fa-arrow-right text-xs"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopPredictors;
