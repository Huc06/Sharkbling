import { Link, useLocation } from "wouter";

const MobileNavigation = () => {
  const [location] = useLocation();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-3 px-6 z-10">
      <div className="flex items-center justify-between">
        <Link href="/">
          <a className={`flex flex-col items-center ${location === "/" ? "text-primary-500" : "text-slate-400"}`}>
            <i className="fas fa-home text-lg"></i>
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        
        <Link href="/markets">
          <a className={`flex flex-col items-center ${location === "/markets" ? "text-primary-500" : "text-slate-400"}`}>
            <i className="fas fa-trophy text-lg"></i>
            <span className="text-xs mt-1">Markets</span>
          </a>
        </Link>
        
        <a href="#" className="flex flex-col items-center text-slate-400">
          <i className="fas fa-plus-circle text-lg"></i>
          <span className="text-xs mt-1">Create</span>
        </a>
        
        <Link href="/my-predictions">
          <a className={`flex flex-col items-center ${location === "/my-predictions" ? "text-primary-500" : "text-slate-400"}`}>
            <i className="fas fa-history text-lg"></i>
            <span className="text-xs mt-1">My Bets</span>
          </a>
        </Link>
        
        <a href="#" className="flex flex-col items-center text-slate-400">
          <i className="fas fa-user text-lg"></i>
          <span className="text-xs mt-1">Profile</span>
        </a>
      </div>
    </div>
  );
};

export default MobileNavigation;
