import React, { useState } from "react";

export default function PaginationButton({
  children,
  active,
  disabled,
  onClick,
  s,
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...s.btn,
        ...(active ? s.active : {}),
        ...(disabled ? s.disabled : {}),
        ...(hovered && !active && !disabled ? s.hover : {}),
      }}
    >
      {children}
    </button>
  );
}
