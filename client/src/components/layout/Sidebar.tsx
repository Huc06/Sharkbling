import { Link, useLocation } from "wouter";
import { useSuiWallet } from "@/hooks/useSuiWallet";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const [location] = useLocation();
  const { isConnected, walletAddress, connectWallet, openConnectWalletModal } = useSuiWallet();

  return (
    <aside className="hidden lg:flex lg:w-64 flex-col bg-white border-r border-slate-200 fixed h-full">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="bg-primary-500 text-white w-8 h-8 rounded-lg flex items-center justify-center">
            <i className="fas fa-chart-line"></i>
          </div>
          <h1 className="font-heading font-bold text-xl">SocialPrediction</h1>
        </div>
      </div>
      
      <nav className="p-2 flex-1">
        <div className="space-y-1">
          <Link href="/">
            <div className={`flex items-center gap-3 p-3 rounded-lg ${location === "/" ? "bg-primary-50 text-primary-600" : "text-slate-600 hover:bg-slate-50"} font-medium cursor-pointer`}>
              <i className="fas fa-home w-5 text-center"></i>
              <span>Dashboard</span>
            </div>
          </Link>
          <Link href="/markets">
            <div className={`flex items-center gap-3 p-3 rounded-lg ${location === "/markets" ? "bg-primary-50 text-primary-600" : "text-slate-600 hover:bg-slate-50"} font-medium cursor-pointer`}>
              <i className="fas fa-trophy w-5 text-center"></i>
              <span>Markets</span>
            </div>
          </Link>
          <Link href="/my-predictions">
            <div className={`flex items-center gap-3 p-3 rounded-lg ${location === "/my-predictions" ? "bg-primary-50 text-primary-600" : "text-slate-600 hover:bg-slate-50"} font-medium cursor-pointer`}>
              <i className="fas fa-history w-5 text-center"></i>
              <span>My Predictions</span>
            </div>
          </Link>
          <div className="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-slate-50 font-medium cursor-pointer">
            <i className="fas fa-coins w-5 text-center"></i>
            <span>Rewards</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-slate-50 font-medium cursor-pointer">
            <i className="fas fa-chart-pie w-5 text-center"></i>
            <span>Analytics</span>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Social Platforms</h3>
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-slate-50 font-medium cursor-pointer">
              <i className="fab fa-github w-5 text-center"></i>
              <span>GitHub</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-slate-50 font-medium cursor-pointer">
              <i className="fab fa-linkedin w-5 text-center"></i>
              <span>LinkedIn</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-slate-50 font-medium cursor-pointer">
              <i className="fas fa-hashtag w-5 text-center"></i>
              <span>Farcaster</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-slate-50 font-medium cursor-pointer">
              <i className="fab fa-discord w-5 text-center"></i>
              <span>Discord</span>
            </div>
          </div>
        </div>
      </nav>
      
      {/* User Profile Mini */}
      <div className="p-4 border-t border-slate-200">
        {isConnected ? (
          <div className="flex items-center gap-3">
            <div className="bg-primary-100 rounded-full w-10 h-10 flex items-center justify-center">
              <i className="fas fa-user text-primary-500"></i>
            </div>
            <div>
              <div className="font-medium text-sm text-slate-900">
                {walletAddress?.substring(0, 6)}...{walletAddress?.substring(walletAddress.length - 4)}
              </div>
              <Button 
                variant="link" 
                className="text-xs text-primary-500 font-medium p-0 h-auto"
              >
                Xem hồ sơ
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 rounded-full w-10 h-10 flex items-center justify-center">
              <i className="fas fa-user text-slate-500"></i>
            </div>
            <div>
              <div className="font-medium text-sm text-slate-900">Chưa kết nối</div>
              <Button 
                variant="link" 
                className="text-xs text-primary-500 font-medium p-0 h-auto"
                onClick={openConnectWalletModal}
              >
                Kết nối ví
              </Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
