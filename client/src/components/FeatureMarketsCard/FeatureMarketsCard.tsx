import React from "react";
import { Clock, Users } from "lucide-react";
import { Market } from "@shared/schema";

interface FeatureMarketCardProps {
  market: Market;
  yesPercentage: number;
  noPercentage: number;
  onPlaceBet: (betType: "yes" | "no") => void;
  onViewDetails: React.MouseEventHandler;
}

const FeatureMarketCard = ({
  market,
  yesPercentage,
  noPercentage,
  onPlaceBet,
  onViewDetails
}: FeatureMarketCardProps) => {
  const platformColors = {
    GitHub: {
      bg: "bg-teal-100",
      text: "text-teal-800",
      progressBar: "bg-blue-500"
    },
    LinkedIn: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      progressBar: "bg-blue-600"
    },
    Farcaster: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      progressBar: "bg-purple-600"
    },
    Discord: {
      bg: "bg-indigo-100",
      text: "text-indigo-800",
      progressBar: "bg-indigo-600"
    }
  };

  const platform = market.platform as keyof typeof platformColors;
  const colors = platformColors[platform] || platformColors.GitHub;

  const statusColors = {
    active: "bg-green-500",
    ended: "bg-yellow-500",
    resolved: "bg-blue-500"
  };

  const status = market.status || "active";
  const statusColor = statusColors[status as keyof typeof statusColors] || statusColors.active;

  return (
    <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className={`flex items-center justify-between p-2 ${colors.bg}`}>
        <span className={`font-medium ${colors.text} text-xs`}>
          {market.platform}
        </span>
        <span className={`px-2 py-0.5 text-xs font-bold text-white rounded-full ${statusColor}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Market Title */}
        <h2 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">
          {market.title}
        </h2>

        {/* Time and Pool Info */}
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <Clock size={12} className="mr-1" />
          <span>{formatTimeLeft(market.endDate)}</span>
          <span className="mx-1">•</span>
          <span>${market.initialPool.toLocaleString()} pool</span>
        </div>

        {/* Prediction Progress */}
        <div className="mb-3">
          <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full rounded-l-full ${colors.progressBar}`}
              style={{ width: `${yesPercentage}%` }}
            ></div>
            <div
              className="absolute top-0 left-0 h-full rounded-r-full bg-red-500"
              style={{ width: `${noPercentage}%`, left: `${yesPercentage}%` }}
            ></div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-600">
            <span>Yes ({yesPercentage.toFixed(0)}%)</span>
            <span>No ({noPercentage.toFixed(0)}%)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-1 mt-auto">
          <button
            onClick={() => onPlaceBet("yes")}
            className="w-full py-1.5 rounded text-xs font-medium text-center bg-teal-200 text-teal-800 hover:bg-teal-300 transition duration-200"
          >
            Predict Yes
          </button>
          <button
            onClick={() => onPlaceBet("no")}
            className="w-full py-1.5 rounded text-xs font-medium text-center bg-blue-200 text-blue-800 hover:bg-blue-300 transition duration-200"
          >
            Predict No
          </button>
        </div>

        {/* Footer */}
        <div className="mt-2 flex items-center justify-between text-xs">
          <div className="flex items-center text-gray-500">
            <Users size={12} className="mr-1" />
            <span>Participants</span>
          </div>
          <button
            onClick={onViewDetails}
            className="text-blue-600 hover:underline font-medium text-xs"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

const formatTimeLeft = (endDate: Date) => {
  const now = new Date();
  const end = new Date(endDate);
  const diffTime = Math.max(end.getTime() - now.getTime(), 0);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays} days`;
};

export default FeatureMarketCard;
