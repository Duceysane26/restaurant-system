import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NavLinkItem from "./NavLinkItem";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/orders", label: "Orders", icon: "📋" },
  { to: "/menu", label: "Menu", icon: "🍔" },
  { to: "/categories", label: "Categories", icon: "📂" },
  { to: "/tables", label: "Tables", icon: "🪑" },
  { to: "/bills", label: "Bills", icon: "🧾" },
];

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [hoveredLink, setHoveredLink] = useState(null);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav style={s.nav}>
      <div style={s.brand}>
        <span style={s.brandIcon}>🍽️</span>
        <span style={s.brandText}>Restaurant</span>
      </div>

      <div style={s.links}>
        {links.map((link) => (
          <NavLinkItem
            key={link.to}
            to={link.to}
            label={link.label}
            icon={link.icon}
            pathname={pathname}
            hoveredLink={hoveredLink}
            setHoveredLink={setHoveredLink}
            s={s}
          />
        ))}

        {/* Halkani waxay tusaysaa qaybta Users haddii qofku Admin yahay */}
        {user?.roleName === "Admin" && (
          <NavLinkItem
            to="/users"
            label="Users"
            icon="👤"
            pathname={pathname}
            hoveredLink={hoveredLink}
            setHoveredLink={setHoveredLink}
            s={s}
          />
        )}
      </div>

      <div style={s.right}>
        <div style={s.userPill}>
          <span style={s.avatar}>
            {user?.fullName?.[0]?.toUpperCase() || "?"}
          </span>
          <div>
            <div style={s.userName}>{user?.fullName}</div>
            <div style={s.userRole}>{user?.roleName}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={s.logoutBtn}
          onMouseEnter={(e) => {
            e.target.style.background = "#dc2626";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255,255,255,0.12)";
            e.target.style.transform = "translateY(0)";
          }}
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}

const s = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "linear-gradient(90deg,#1e1b4b 0%,#2d3561 100%)",
    padding: "0 24px",
    height: 64,
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
    gap: 16,
  },
  brand: { display: "flex", alignItems: "center", gap: 10, flexShrink: 0 },
  brandIcon: {
    fontSize: 28,
    filter: "drop-shadow(0 2px 4px rgba(255,107,53,0.5))",
  },
  brandText: {
    fontSize: 20,
    fontWeight: 800,
    color: "#fff",
    background: "linear-gradient(90deg,#ff6b35,#f7c59f)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  links: {
    display: "flex",
    gap: 4,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "rgba(255,255,255,0.65)",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 500,
    padding: "6px 12px",
    borderRadius: 10,
    transition: "all .2s",
    position: "relative",
  },
  linkHover: { color: "#fff", background: "rgba(255,255,255,0.1)" },
  linkActive: {
    color: "#fff",
    background: "rgba(255,107,53,0.25)",
    fontWeight: 700,
  },
  activeDot: {
    position: "absolute",
    bottom: -2,
    left: "50%",
    transform: "translateX(-50%)",
    width: 4,
    height: 4,
    borderRadius: "50%",
    background: "#ff6b35",
  },
  right: { display: "flex", alignItems: "center", gap: 12, flexShrink: 0 },
  userPill: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "6px 14px 6px 8px",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#ff6b35,#f7c59f)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    color: "#fff",
    fontSize: 14,
  },
  userName: { fontSize: 13, fontWeight: 600, color: "#fff", lineHeight: 1.2 },
  userRole: { fontSize: 11, color: "rgba(255,255,255,0.55)" },
  logoutBtn: {
    background: "rgba(255,255,255,0.12)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "7px 14px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    transition: "all .2s",
  },
};
