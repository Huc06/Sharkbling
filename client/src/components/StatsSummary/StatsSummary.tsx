import React from "react";
import "./StatsSummary.css";
import { StatsSummaryProps } from "@/types/StatsSummaryType";

const StatsSummary: React.FC<StatsSummaryProps> = ({
  icon: Icon,
  value,
  label,
  change,
}) => {
  return (
    <div className="theme-secondary-bg text-white p-6 rounded-xl flex items-center justify-between w-80 relative shadow-md shadow-[var(--color-text)] border-2 border-slate-200">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-secondary text-lg">{label}</p>
          <h2 className="text-3xl font-bold text-accent">{value}</h2>
        </div>
      </div>
        <Icon className="text-orange-400 ml-5" size={28} />
      <span className="text-green-400 absolute top-4 right-4 text-base font-semibold">{change}</span>
    </div>
  );
};

export default StatsSummary;
