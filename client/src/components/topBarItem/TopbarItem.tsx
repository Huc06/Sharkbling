import React from "react";
import "./topBarItem.css";


const TopBarItem: React.FC<TopBarItemProps> = ({ title, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`ml-3 topbarbar-item text-secondary ${isActive ? "active" : "" }` }
    >
      <span className="topbarbar-title">{title}</span>
    </div>
  );
};

export default TopBarItem;
