import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import MobileNavigation from "@/components/layout/MobileNavigation";
import StatsSummary from "@/components/dashboard/StatsSummary";
import FeaturedMarkets from "@/components/dashboard/FeaturedMarkets";
import SocialTrends from "@/components/dashboard/SocialTrends";
import UserStats from "@/components/dashboard/UserStats";
import ReputationNFTs from "@/components/dashboard/ReputationNFTs";
import TopPredictors from "@/components/dashboard/TopPredictors";
import CreateMarketBanner from "@/components/dashboard/CreateMarketBanner";
import SuiWalletInfo from "@/components/wallet/SuiWalletInfo";

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen lg:flex-row">
      {/* Sidebar (desktop only) */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        {/* TopBar */}
        <TopBar />

        {/* Content area */}
        <div className="pt-16 pb-16 lg:pb-0">
          <div className="p-4 sm:p-6 md:p-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2">Welcome to SocialPrediction</h1>
              <p className="text-slate-600">Predict outcomes on social media trends and earn rewards on Sui blockchain.</p>
            </div>

            {/* Stats Summary */}
            <StatsSummary />

            {/* Featured Markets */}
            <FeaturedMarkets />

            {/* Create Market Banner */}
            <CreateMarketBanner />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Social Trends Section */}
              <div className="lg:col-span-2">
                <SocialTrends />
              </div>

              {/* Side Section */}
              <div className="space-y-6">
                {/* Sui Wallet Info */}
                <div className="mb-6">
                  <SuiWalletInfo />
                </div>
                
                {/* User Stats */}
                <UserStats />
                
                {/* Reputation NFTs */}
                <ReputationNFTs />
                
                {/* Top Predictors */}
                <TopPredictors />
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <MobileNavigation />
      </main>
    </div>
  );
};

export default Dashboard;
