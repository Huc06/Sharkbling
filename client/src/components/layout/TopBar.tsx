import { useState } from "react";
import TopbarItem from "../topBarItem/TopbarItem";
import ConnectWalletButton from "./ConnectWalletButton";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Link, useLocation } from "wouter";

const TopBar = () => {
  const currentAccount = useCurrentAccount();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [location] = useLocation();

  const isConnected = !!currentAccount;

  const navigationItems = [
    { title: "Dashboard", path: "/" },
    { title: "Markets", path: "/markets" },
    { title: "My Predictions", path: "/my-predictions" },
    { title: "Rewards", path: "/rewards" },
  ];

  const socialNavigation = [
    { title: "X", icon: <i className="fab fa-twitter"></i> },
  ];

  return (
    <header className="bg-primary-500 border-b border-slate-200 fixed top-0 right-0 left-0 z-10 theme-secondary-bg ">
      <div className="px-4 py-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white text-primary-500 w-8 h-8 rounded-lg flex items-center justify-center">
            <i className="fas fa-chart-line"></i>
          </div>
          <h1 className="font-heading font-bold text-xl text-secondary ">
            Analytics Pro
          </h1>
          <div className="flex items-center space-x-4 ">
            {navigationItems.map((item) => (
              <Link href={item.path} key={item.title}>
                <TopbarItem
                  title={item.title}
                  isActive={location === item.path}
                  onClick={() => setActiveItem(item.title)}
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search analytics..."
              className="border border-gray-300 rounded-3 py-2 pl-10 pr-4 text-sm w-64
                        hover:bg-primary transition-colors hover:border hover:border-[var(--color-secondary)]
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        placeholder:text-gray-600"
            />
          </div>

          <div className="relative">
            <button className="p-2 rounded-lg text-primary-500 .text-secondary ">
              <i className="fas fa-bell"></i>
            </button>
            <span className="absolute -top-1 -right-1 bg-errortext-secondary  text-xs w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </div>

          <div className="lg:block bg-theme-secondary">
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
