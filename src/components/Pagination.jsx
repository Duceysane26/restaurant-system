import React from "react";
import PaginationButton from "./PaginationButton";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div style={s.container}>
      {/* Badhanka Previous */}
      <PaginationButton
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        s={s}
      >
        ← Prev
      </PaginationButton>

      {/* Lambarada Bogbogyada (Pages) */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <PaginationButton
          key={p}
          active={p === page}
          onClick={() => onPageChange(p)}
          s={s}
        >
          {p}
        </PaginationButton>
      ))}

      {/* Badhanka Next */}
      <PaginationButton
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        s={s}
      >
        Next →
      </PaginationButton>
    </div>
  );
}

const s = {
  container: {
    display: "flex",
    gap: 6,
    justifyContent: "center",
    marginTop: 24,
    flexWrap: "wrap",
  },
  btn: {
    padding: "7px 14px",
    border: "2px solid #e5e7eb",
    borderRadius: 8,
    cursor: "pointer",
    background: "#fff",
    color: "#374151",
    fontWeight: 500,
    fontSize: 13,
    transition: "all .18s",
    fontFamily: "inherit",
    outline: "none",
  },
  active: {
    background: "linear-gradient(135deg,#ff6b35,#e55a28)",
    color: "#fff",
    border: "2px solid #ff6b35",
    boxShadow: "0 4px 12px rgba(255,107,53,0.35)",
    transform: "scale(1.08)",
  },
  hover: { borderColor: "#ff6b35", color: "#ff6b35", background: "#fff" },
  disabled: {
    opacity: 0.4,
    cursor: "not-allowed",
    borderColor: "#e5e7eb",
    color: "#9ca3af",
  },
};
