import { useLocation } from "wouter";
import { useSuiWallet } from "@/hooks/useSuiWallet";
import { Button } from "@/components/ui/button";
import SidebarItem from "../SidebarItem/SidebarItem";
import { useState } from "react";

const Sidebar = () => {
  const [location] = useLocation();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const { isConnected, walletAddress, openConnectWalletModal } = useSuiWallet();

  const navigationItems = [
    { title: "Dashboard", icon: <i className="fas fa-home"></i> },
    { title: "Markets", icon: <i className="fas fa-chart-bar"></i> },
    { title: "My Predictions", icon: <i className="fas fa-bullseye"></i> },
    { title: "Rewards", icon: <i className="fas fa-trophy"></i> },
  ];

  const socialNavigation = [
    { title: "X", icon: <i className="fab fa-twitter"></i> },
  ];

  return (
    <aside className="hidden lg:flex lg:w-64 flex-col border-slate-200 fixed h-full bg-gradient-to-br text-white">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="bg-primary-700 text-white w-8 h-8 rounded-lg flex items-center justify-center">
            <i className="fas fa-chart-line"></i>
          </div>
          <h1 className="font-heading font-bold text-xl">SocialPrediction</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-2 flex-1">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <SidebarItem
              key={item.title}
              title={item.title}
              icon={item.icon}
              isActive={activeItem === item.title}
              onClick={() => setActiveItem(item.title)}
            />
          ))}
        </div>

        {/* Social Platforms */}
        <div className="mt-6">
          <h3 className="px-3 text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Social Platforms
          </h3>
          <div className="mt-2 space-y-1">
            {socialNavigation.map((item) => (
              <SidebarItem
                key={item.title}
                title={item.title}
                icon={item.icon}
                isActive={activeItem === item.title}
                onClick={() => setActiveItem(item.title)}
              />
            ))}
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
              <div className="font-medium text-sm text-white">
                {walletAddress?.substring(0, 6)}...
                {walletAddress?.substring(walletAddress.length - 4)}
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
              <div className="font-medium text-sm text-white">Chưa kết nối</div>
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
