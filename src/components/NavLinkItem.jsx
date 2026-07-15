import React from "react";
import { Link } from "react-router-dom";

export default function NavLinkItem({
  to,
  label,
  icon,
  pathname,
  hoveredLink,
  setHoveredLink,
  s,
}) {
  const active = pathname === to;

  return (
    <Link
      to={to}
      style={{
        ...s.link,
        ...(active ? s.linkActive : {}),
        ...(hoveredLink === to && !active ? s.linkHover : {}),
      }}
      onMouseEnter={() => setHoveredLink(to)}
      onMouseLeave={() => setHoveredLink(null)}
    >
      <span>{icon}</span>
      <span>{label}</span>
      {active && <span style={s.activeDot} />}
    </Link>
  );
}
