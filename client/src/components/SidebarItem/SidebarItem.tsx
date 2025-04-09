import React from "react";
import "./SidebarItem.css";


const SidebarItem: React.FC<SidebarItemProps> = ({ title, icon, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`sidebar-item ${isActive ? "active" : ""}`}
    >
      {icon && <span>{icon}</span>}
      <span className="sidebar-title">{title}</span>
    </div>
  );
};

export default SidebarItem;
