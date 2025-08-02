// src/components/SidebarMenuCommercial.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/sidebarMenu.css";

const SidebarMenuCommercial = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: "fas fa-shopping-cart", path: "/commerciale/ventes" },
    { icon: "fas fa-user-plus",  path: "/commerciale/leads" },
    { icon: "fas fa-file-signature",  path: "/commerciale/promesses" },
  ];

  return (
    <div className="sidebar-menu">
      {menuItems.map((item, index) => (
        <div
          key={index}
          className="sidebar-item"
          onClick={() => navigate(item.path)}
          role="button"
          tabIndex={0}
        >
          <i className={`sidebar-icon ${item.icon}`}></i>
          <span className="sidebar-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default SidebarMenuCommercial;
