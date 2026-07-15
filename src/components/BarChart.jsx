import React from "react";

const bc = {
  wrap: {
    display: "flex",
    alignItems: "flex-end",
    gap: 10,
    height: 180,
    paddingTop: 24,
    position: "relative",
  },
  col: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
  },
  barWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    width: "100%",
  },
  bar: {
    width: "100%",
    maxWidth: 40,
    borderRadius: "6px 6px 0 0",
    transition: "height .6s cubic-bezier(.34,1.56,.64,1)",
    minHeight: 4,
  },
  valLabel: {
    fontSize: 10,
    color: "#6b7280",
    fontWeight: 600,
    marginBottom: 4,
    height: 14,
  },
  label: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: 500,
    textAlign: "center",
  },
};

export default function BarChart({ data, maxVal }) {
  return (
    <div style={bc.wrap}>
      {data.map((d, i) => (
        <div key={i} style={bc.col}>
          <div style={bc.barWrap}>
            <div style={bc.valLabel}>
              {d.value > 0 ? `$${d.value.toFixed(0)}` : ""}
            </div>
            <div
              style={{
                ...bc.bar,
                height:
                  maxVal > 0
                    ? `${Math.max(4, (d.value / maxVal) * 140)}px`
                    : "4px",
                background:
                  i === data.length - 1
                    ? "linear-gradient(180deg,#ff6b35,#e55a28)"
                    : "linear-gradient(180deg,#4f46e5,#6366f1)",
                animationDelay: `${i * 0.08}s`,
              }}
              className="animate-fade"
            />
          </div>
          <div style={bc.label}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}
