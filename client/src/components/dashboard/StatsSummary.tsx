import { useQuery } from "@tanstack/react-query";
import StatsSummary from "../StatsSummary/StatsSummary";
import { User, Trophy, Clock, Coins } from "lucide-react";

interface Market {
  status: string;
  initialPool: number;
  // ... other properties
}

const DashboardStatsSummary = () => {
  const { data: markets } = useQuery({
    queryKey: ["/api/markets"],
  });

  const activeMarkets =
    (markets as Market[] | undefined)?.filter((m) => m.status === "active")
      .length || 0;
  const totalVolume = markets
    ? (markets as Market[]).reduce(
        (sum, market) => sum + market.initialPool,
        0
      ) / 1000
    : 0;
  const totalRewards = totalVolume * 0.75; // 75% of volume goes to rewards for display purpose

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatsSummary icon={User} value={activeMarkets} label="Active User" />
      <StatsSummary icon={Coins} value={activeMarkets} label="Active Market" />
      <StatsSummary icon={Trophy} value={activeMarkets} label="Active User" />
      <StatsSummary icon={Clock} value={activeMarkets} label="Active User" />
    </div>
  );
};

export default DashboardStatsSummary;
