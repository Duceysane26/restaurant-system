import React from "react";

const dc = {
  wrap: { display: "flex", alignItems: "center", gap: 24 },
  legend: { display: "flex", flexDirection: "column", gap: 8, flex: 1 },
  legendRow: { display: "flex", alignItems: "center", gap: 8 },
  dot: { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 },
  legendLabel: { fontSize: 13, color: "#374151", flex: 1 },
  legendVal: { fontSize: 13, fontWeight: 700, color: "#1e1b4b" },
};

export default function DonutChart({ slices }) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  let cumPct = 0;
  const segments = slices.map((sl) => {
    const pct = (sl.value / total) * 100;
    const seg = { ...sl, pct, start: cumPct };
    cumPct += pct;
    return seg;
  });

  const r = 60,
    cx = 70,
    cy = 70,
    stroke = 28;
  const circ = 2 * Math.PI * r;

  return (
    <div style={dc.wrap}>
      <svg width={140} height={140} viewBox="0 0 140 140">
        {segments.length === 0 || total === 0 ? (
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={stroke}
          />
        ) : (
          segments.map((seg, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeDasharray={`${(seg.pct / 100) * circ} ${circ}`}
              strokeDashoffset={`${-((seg.start / 100) * circ)}`}
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "70px 70px",
                transition: "stroke-dasharray .6s ease",
              }}
            />
          ))
        )}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fontSize={11}
          fill="#6b7280"
          fontFamily="inherit"
        >
          Revenue
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fontSize={13}
          fill="#1e1b4b"
          fontWeight="700"
          fontFamily="inherit"
        >
          ${total.toFixed(0)}
        </text>
      </svg>
      <div style={dc.legend}>
        {segments.map((seg, i) => (
          <div key={i} style={dc.legendRow}>
            <span style={{ ...dc.dot, background: seg.color }} />
            <span style={dc.legendLabel}>{seg.label}</span>
            <span style={dc.legendVal}>${seg.value.toFixed(0)}</span>
          </div>
        ))}
        {segments.length === 0 && (
          <span style={{ color: "#9ca3af", fontSize: 13 }}>No data</span>
        )}
      </div>
    </div>
  );
}
