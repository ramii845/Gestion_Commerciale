import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/sidebarMenu.css";
const SidebarMenuAdmin = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: "fas fa-shopping-cart", path: "/manager/ventes", tooltip: "Ventes" },
    { icon: "fas fa-user-plus", path: "/manager/leads", tooltip: "Leads" },
    { icon: "fas fa-file-signature", path: "/manager/promesses", tooltip: "Promesses" },
    { icon: "fas fa-users", path: "/list", tooltip: "Utilisateurs" },
    { icon: "fas fa-archive", path: "/manager/archives", tooltip: "Archives" },
  ];

  return (
    <div className="sidebar-menu">
      {menuItems.map((item, index) => (
        <div
          key={index}
          className="sidebar-item"
          onClick={() => navigate(item.path)}
          data-tooltip={item.tooltip}
          role="button"
          tabIndex={0}
        >
          <i className={`sidebar-icon ${item.icon}`}></i>
          <span className="sidebar-label">{item.tooltip}</span>
        </div>
      ))}
    </div>
  );
};

export default SidebarMenuAdmin;
