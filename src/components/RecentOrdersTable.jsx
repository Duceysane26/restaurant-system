import React from "react";

const statusCfg = {
  Pending: { bg: "#fef3c7", color: "#92400e", icon: "⏳" },
  InProgress: { bg: "#dbeafe", color: "#1e40af", icon: "🔄" },
  Completed: { bg: "#d1fae5", color: "#065f46", icon: "✅" },
  Cancelled: { bg: "#fee2e2", color: "#991b1b", icon: "❌" },
};

export default function RecentOrdersTable({ recentOrders, s }) {
  return (
    <table style={s.miniTable}>
      <thead>
        <tr style={s.miniThead}>
          <th style={s.miniTh}>Order</th>
          <th style={s.miniTh}>Table</th>
          <th style={s.miniTh}>Status</th>
          <th style={s.miniTh}>Date</th>
        </tr>
      </thead>
      <tbody>
        {recentOrders.length === 0 ? (
          <tr>
            <td colSpan={4} style={s.emptyTd}>
              No orders yet
            </td>
          </tr>
        ) : (
          recentOrders.map((o, i) => {
            const cfg = statusCfg[o.status] || statusCfg.Pending;
            return (
              <tr
                key={o.orderId}
                style={{ animationDelay: `${i * 0.05}s` }}
                className="animate-fade"
              >
                <td style={s.miniTd}>
                  <strong style={{ color: "#4f46e5" }}>#{o.orderId}</strong>
                </td>
                <td style={s.miniTd}>Table {o.tableId}</td>
                <td style={s.miniTd}>
                  <span
                    style={{ ...s.badge, background: cfg.bg, color: cfg.color }}
                  >
                    {cfg.icon} {o.status}
                  </span>
                </td>
                <td style={s.miniTd}>
                  <span style={{ color: "#9ca3af", fontSize: 12 }}>
                    {new Date(o.orderDate).toLocaleDateString()}
                  </span>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
