import ConnectWalletButton from "./ConnectWalletButton";
import { useCurrentAccount } from '@mysten/dapp-kit';

const TopBar = () => {
  const currentAccount = useCurrentAccount();
  const isConnected = !!currentAccount;

  return (
    <>
      <header className="bg-white border-b border-slate-200 fixed top-0 right-0 left-0 lg:left-64 z-10">
        <div className="px-4 py-3 sm:px-6 flex items-center justify-between">
          <div className="lg:hidden flex items-center gap-3">
            <div className="bg-primary-500 text-white w-8 h-8 rounded-lg flex items-center justify-center">
              <i className="fas fa-chart-line"></i>
            </div>
            <h1 className="font-heading font-bold text-xl">SocialPrediction</h1>
          </div>
          
          {/* Wallet Connect (mobile) */}
          <div className="lg:hidden">
            <ConnectWalletButton />
          </div>
          
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Tìm kiếm thị trường..." 
                className="border border-slate-300 rounded-lg py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
            </div>
            
            <div className="relative">
              <button className="bg-primary-50 p-2 rounded-lg text-primary-500">
                <i className="fas fa-bell"></i>
              </button>
              <span className="absolute -top-1 -right-1 bg-error text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <ConnectWalletButton />
          </div>
        </div>
      </header>
    </>
  );
};

export default TopBar;
