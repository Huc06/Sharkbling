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
    GitHub: "bg-blue-500",
    LinkedIn: "bg-blue-700",
    Farcaster: "bg-purple-600",
    Discord: "bg-indigo-600"
  };

  return (
    <div className=" max-w-sm w-full bg-white dark:bg-gray-800 rounded-xl shadow-md transition-transform transform hover:scale-105">
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between bg-primary p-5 rounded-t-xl">
          <span className="font-medium text-white text-l">
            {market.platform}
          </span>
          <span className="px-2 py-1 text-xs font-bold text-white bg-green-500 rounded-full">
            Active
          </span>
        </div>

        {/* Market Title */}
        <h2 className="mt-3 text-xl font-semibold text-gray-800 dark:text-white px-5">
          {market.title}
        </h2>

        {/* Time and Pool Info */}
        <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400 px-5">
          <Clock size={16} className="mr-1" />
          <span>{formatTimeLeft(market.endDate)}</span>
          <span className="mx-2">•</span>
          <span>${market.initialPool.toLocaleString()} pool</span>
        </div>

        {/* Prediction Progress */}
        <div className="mt-4 px-5">
          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ">
            <div
              className={`absolute top-0 left-0 h-full rounded-full ${platformColors[market.platform as keyof typeof platformColors]}`}
              style={{ width: `${yesPercentage}%` }}
            ></div>
            <div
              className={`absolute top-0 left-0 h-full rounded-full bg-red-500`}
              style={{ width: `${noPercentage}%`, left: `${yesPercentage}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Yes ({yesPercentage.toFixed(0)}%)</span>
            <span>No ({noPercentage.toFixed(0)}%)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 space-y-3 px-5">
          <button
            onClick={() => onPlaceBet("yes")}
            className={` bg-primary w-full py-2 rounded-lg font-semibold text-black  ${platformColors[market.platform as keyof typeof platformColors]} hover:opacity-90 transition duration-200`}
          >
            Predict Yes
          </button>
          <button
            onClick={() => onPlaceBet("no")}
            className="w-full py-2 rounded-lg font-semibold bg-tag-politics dark:bg-gray-600 text-gray-800 dark:text-gray-200  dark:hover:bg-gray-500 transition duration-200"
          >
            Predict No
          </button>
        </div>

        {/* Footer */}
        <div className="my-5 flex items-center justify-between text-sm px-5">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Users size={16} className="mr-1" />
            <span>Participants</span>
          </div>
          <button
            onClick={onViewDetails}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
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
