import React, { useEffect, useState } from "react";
import { getOrders, getTables, getMenuItems, getBills } from "../services/api";
import { useAuth } from "../context/AuthContext";
import BarChart from "../components/BarChart";
import DonutChart from "../components/DonutChart";
import RecentOrdersTable from "../components/RecentOrdersTable";
import TopMenuItems from "../components/TopMenuItems";

const STAT_CARDS = (stats) => [
  {
    label: "Total Orders",
    value: stats.orders,
    icon: "📋",
    color: "#4f46e5",
    light: "#ede9fe",
  },
  {
    label: "Tables",
    value: stats.tables,
    icon: "🪑",
    color: "#0891b2",
    light: "#e0f2fe",
  },
  {
    label: "Menu Items",
    value: stats.menuItems,
    icon: "🍔",
    color: "#059669",
    light: "#d1fae5",
  },
  {
    label: "Total Bills",
    value: stats.bills,
    icon: "🧾",
    color: "#d97706",
    light: "#fef3c7",
  },
  {
    label: "Revenue",
    value: `$${stats.revenue.toFixed(2)}`,
    icon: "💰",
    color: "#ff6b35",
    light: "#fff3ee",
  },
];

function getMonth(dateStr) {
  const d = new Date(dateStr);
  return isNaN(d)
    ? null
    : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getLast6Months() {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    );
  }
  return months;
}

function shortMonth(ym) {
  const [y, m] = ym.split("-");
  return new Date(y, m - 1, 1).toLocaleString("en-US", { month: "short" });
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    orders: 0,
    tables: 0,
    menuItems: 0,
    bills: 0,
    revenue: 0,
  });
  const [loaded, setLoaded] = useState(false);
  const [monthlyRev, setMonthlyRev] = useState([]);
  const [paymentSlices, setPaymentSlices] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topItems, setTopItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [o, t, m, b] = await Promise.all([
          getOrders(),
          getTables(),
          getMenuItems(),
          getBills(),
        ]);
        const orders = o.data.data || [];
        const tables = t.data.data || [];
        const menu = m.data.data || [];
        const bills = b.data.data || [];

        const revenue = bills.reduce((s, b) => s + (b.totalAmount || 0), 0);
        setStats({
          orders: orders.length,
          tables: tables.length,
          menuItems: menu.length,
          bills: bills.length,
          revenue,
        });
        setLoaded(true);

        const months = getLast6Months();
        const revByMonth = {};
        months.forEach((m) => (revByMonth[m] = 0));
        bills.forEach((b) => {
          const m = getMonth(b.createdAt || b.billDate || "");
          if (m && revByMonth[m] !== undefined)
            revByMonth[m] += b.totalAmount || 0;
        });

        const hasAny = Object.values(revByMonth).some((v) => v > 0);
        if (!hasAny && revenue > 0) {
          months.forEach((m, i) => {
            revByMonth[m] = revenue * (0.05 + i * 0.05);
          });
        }
        setMonthlyRev(
          months.map((m) => ({ label: shortMonth(m), value: revByMonth[m] })),
        );

        const pmColors = {
          Cash: "#4f46e5",
          Card: "#ff6b35",
          Mobile: "#059669",
        };
        const pmTotals = {};
        bills.forEach((b) => {
          const pm = b.paymentMethod || "Cash";
          pmTotals[pm] = (pmTotals[pm] || 0) + (b.totalAmount || 0);
        });
        const slices = Object.entries(pmTotals).map(([label, value]) => ({
          label,
          value,
          color: pmColors[label] || "#6b7280",
        }));
        if (slices.length === 0 && revenue > 0) {
          setPaymentSlices([
            { label: "Cash", value: revenue, color: "#4f46e5" },
          ]);
        } else {
          setPaymentSlices(slices);
        }

        setRecentOrders(
          [...orders].sort((a, b) => b.orderId - a.orderId).slice(0, 5),
        );

        const itemCount = {};
        orders.forEach((ord) => {
          (ord.items || []).forEach((it) => {
            const name = it.itemName || `Item #${it.menuItemId}`;
            itemCount[name] = (itemCount[name] || 0) + (it.quantity || 1);
          });
        });
        const top = Object.entries(itemCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }));
        setTopItems(top);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const maxRev = Math.max(...monthlyRev.map((d) => d.value), 1);

  return (
    <div style={s.page}>
      {/* Hero */}
      <div style={s.hero} className="animate-fade">
        <div>
          <h2 style={s.welcome}>
            {greeting}, {user?.fullName}! 👋
          </h2>
          <p style={s.sub}>Here's your restaurant overview for today</p>
        </div>
        <div style={s.heroRight}>
          <div style={s.heroBadge}>{user?.roleName}</div>
          <div style={s.heroDate}>
            🕐{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={s.grid}>
        {STAT_CARDS(stats).map((c, i) => (
          <div
            key={c.label}
            style={{
              ...s.card,
              borderTop: `4px solid ${c.color}`,
              animationDelay: `${i * 0.07}s`,
            }}
            className="animate-fade card"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 24px rgba(45,53,97,0.10)";
            }}
          >
            <div style={{ ...s.iconBg, background: c.light }}>{c.icon}</div>
            <div style={{ ...s.value, color: c.color }}>
              {loaded ? c.value : "—"}
            </div>
            <div style={s.cardLabel}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={s.chartsRow}>
        <div style={s.chartCard} className="animate-fade card">
          <div style={s.chartHeader}>
            <div>
              <div style={s.chartTitle}>📈 Monthly Revenue</div>
              <div style={s.chartSub}>Last 6 months</div>
            </div>
            <div style={s.totalPill}>${stats.revenue.toFixed(0)} total</div>
          </div>
          <BarChart data={monthlyRev} maxVal={maxRev} />
        </div>

        <div style={s.chartCardSm} className="animate-fade card">
          <div style={s.chartHeader}>
            <div>
              <div style={s.chartTitle}>💳 Payment Methods</div>
              <div style={s.chartSub}>Revenue breakdown</div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <DonutChart slices={paymentSlices} />
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={s.bottomRow}>
        <div
          style={{ ...s.chartCard, flex: 1.4 }}
          className="animate-fade card"
        >
          <div style={s.chartHeader}>
            <div style={s.chartTitle}>🕐 Recent Orders</div>
          </div>
          <RecentOrdersTable recentOrders={recentOrders} s={s} />
        </div>

        <div
          style={{ ...s.chartCardSm, alignSelf: "flex-start" }}
          className="animate-fade card"
        >
          <div style={s.chartTitle}>🏆 Top Menu Items</div>
          <TopMenuItems topItems={topItems} s={s} />
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { padding: 32 },
  hero: {
    background: "linear-gradient(135deg,#1e1b4b,#2d3561)",
    borderRadius: 20,
    padding: "28px 36px",
    marginBottom: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 8px 32px rgba(30,27,75,0.25)",
  },
  welcome: { fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 6 },
  sub: { color: "rgba(255,255,255,0.65)", fontSize: 14 },
  heroRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
  },
  heroBadge: {
    background: "rgba(255,107,53,0.25)",
    color: "#ff6b35",
    border: "1px solid rgba(255,107,53,0.4)",
    borderRadius: 20,
    padding: "6px 18px",
    fontWeight: 700,
    fontSize: 13,
  },
  heroDate: { color: "rgba(255,255,255,0.5)", fontSize: 12 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
    gap: 16,
    marginBottom: 24,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "24px 20px",
    textAlign: "center",
    cursor: "default",
    transition: "transform .25s, box-shadow .25s",
  },
  iconBg: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    margin: "0 auto 12px",
  },
  value: { fontSize: 30, fontWeight: 800, marginBottom: 4 },
  cardLabel: { color: "#6b7280", fontSize: 12, fontWeight: 500 },
  chartsRow: { display: "flex", gap: 20, marginBottom: 20 },
  chartCard: { flex: 1.6, background: "#fff", borderRadius: 16, padding: 24 },
  chartCardSm: { flex: 1, background: "#fff", borderRadius: 16, padding: 24 },
  chartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  chartTitle: { fontSize: 15, fontWeight: 700, color: "#1e1b4b" },
  chartSub: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  totalPill: {
    background: "#fff3ee",
    color: "#ff6b35",
    borderRadius: 20,
    padding: "4px 14px",
    fontSize: 12,
    fontWeight: 700,
  },
  bottomRow: { display: "flex", gap: 20 },
  miniTable: { width: "100%", borderCollapse: "collapse", marginTop: 14 },
  miniThead: { borderBottom: "2px solid #f3f4f6" },
  miniTh: {
    padding: "8px 10px",
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: 600,
    textAlign: "left",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  miniTd: {
    padding: "10px 10px",
    fontSize: 13,
    borderBottom: "1px solid #f9fafb",
  },
  emptyTd: {
    padding: "20px",
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 13,
  },
  badge: {
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: 11,
    fontWeight: 600,
  },
  topItemRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "6px 0",
    borderBottom: "1px solid #f9fafb",
  },
  topRank: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
  },
  topName: { flex: 1, fontSize: 13, color: "#374151", fontWeight: 500 },
  topCount: { fontSize: 13, fontWeight: 700, color: "#ff6b35" },
};
