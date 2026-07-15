import React from "react";

export default function TopMenuItems({ topItems, s }) {
  return (
    <div
      style={{
        marginTop: 16,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {topItems.length === 0 ? (
        <div
          style={{
            color: "#9ca3af",
            fontSize: 13,
            textAlign: "center",
            padding: "12px 0",
          }}
        >
          No order data yet
        </div>
      ) : (
        topItems.map((item, i) => (
          <div key={i} style={s.topItemRow}>
            <span
              style={{
                ...s.topRank,
                background:
                  i === 0 ? "#fef3c7" : i === 1 ? "#f3f4f6" : "#f9fafb",
                color: i === 0 ? "#92400e" : "#6b7280",
              }}
            >
              #{i + 1}
            </span>
            <span style={s.topName}>{item.name}</span>
            <span style={s.topCount}>{item.count}x</span>
          </div>
        ))
      )}
      {topItems.length === 0 && (
        <div style={{ color: "#9ca3af", fontSize: 12, textAlign: "center" }}>
          Orders with items will appear here
        </div>
      )}
    </div>
  );
}
