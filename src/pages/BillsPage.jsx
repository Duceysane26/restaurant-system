import React, { useEffect, useState } from "react";
import { getBills, getOrders, generateBill } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";
import BillForm from "../components/forms/BillForm"; // Halkan ayaan soo gashanney Form-gii goonida ahaa

const PAGE_SIZE = 5;

export default function BillsPage() {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    orderId: "",
    taxRate: 15,
    discountAmount: 0,
    paymentMethod: "Cash",
  });
  const [msg, setMsg] = useState({ text: "", type: "" });

  const load = async () => {
    try {
      const [b, o] = await Promise.all([getBills(), getOrders()]);
      setBills(b.data.data || []);
      const billedIds = new Set((b.data.data || []).map((b) => b.orderId));
      setCompletedOrders(
        (o.data.data || []).filter(
          (o) =>
            o.status !== "Cancelled" &&
            o.status !== "Completed" &&
            !billedIds.has(o.orderId),
        ),
      );
    } catch {}
  };
  useEffect(() => {
    load();
  }, []);

  const totalPages = Math.ceil(bills.length / PAGE_SIZE);
  const paged = bills.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const flash = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await generateBill({
        ...form,
        orderId: Number(form.orderId),
        cashierId: user.userId,
        taxRate: Number(form.taxRate),
        discountAmount: Number(form.discountAmount),
      });
      flash("Bill generated!");
      setShowForm(false);
      setForm({
        orderId: "",
        taxRate: 15,
        discountAmount: 0,
        paymentMethod: "Cash",
      });
      load();
    } catch (err) {
      flash(err.response?.data?.message || "Error", "error");
    }
  };

  const totalRevenue = bills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div style={s.page}>
      <div style={s.header} className="animate-fade">
        <div>
          <h2 style={s.title}>🧾 Bills</h2>
          <p style={s.sub}>
            {bills.length} bills ·{" "}
            <strong style={{ color: "#059669" }}>
              ${totalRevenue.toFixed(2)}
            </strong>{" "}
            total revenue
          </p>
        </div>
        <button
          style={s.addBtn}
          onClick={() => setShowForm(true)}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-2px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          + Generate Bill
        </button>
      </div>

      {msg.text && (
        <div
          style={{
            ...s.msg,
            ...(msg.type === "error" ? s.msgError : s.msgSuccess),
          }}
          className="animate-slide"
        >
          {msg.type === "error" ? "⚠️" : "✅"} {msg.text}
        </div>
      )}

      {/* Form-kii halkan ayaan ugu wagnay asagoo madax-banaan */}
      {showForm && (
        <BillForm
          form={form}
          setForm={setForm}
          completedOrders={completedOrders}
          handleSubmit={handleSubmit}
          setShowForm={setShowForm}
          s={s}
        />
      )}

      <div style={s.tableWrap} className="card animate-fade">
        <table style={s.table}>
          <thead>
            <tr style={s.thead}>
              <th style={s.th}>Bill #</th>
              <th style={s.th}>Order #</th>
              <th style={s.th}>Subtotal</th>
              <th style={s.th}>Tax</th>
              <th style={s.th}>Discount</th>
              <th style={s.th}>Total</th>
              <th style={s.th}>Payment</th>
              <th style={s.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={8} style={s.empty}>
                  No bills yet 📭
                </td>
              </tr>
            ) : (
              paged.map((b, i) => (
                <tr
                  key={b.billId}
                  className="animate-fade"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <td style={s.td}>
                    <strong style={{ color: "#4f46e5" }}>#{b.billId}</strong>
                  </td>
                  <td style={s.td}>
                    <span style={s.ordBadge}>#{b.orderId}</span>
                  </td>
                  <td style={s.td}>${Number(b.subTotal || 0).toFixed(2)}</td>
                  <td style={s.td}>
                    <span style={{ color: "#d97706" }}>
                      ${Number(b.taxAmount || 0).toFixed(2)}
                    </span>
                  </td>
                  <td style={s.td}>
                    <span style={{ color: "#7c3aed" }}>
                      ${Number(b.discountAmount || 0).toFixed(2)}
                    </span>
                  </td>
                  <td style={s.td}>
                    <strong style={{ color: "#059669", fontSize: 15 }}>
                      ${Number(b.totalAmount || 0).toFixed(2)}
                    </strong>
                  </td>
                  <td style={s.td}>{b.paymentMethod}</td>
                  <td style={s.td}>
                    <span style={b.isPaid ? s.badgeGreen : s.badgeYellow}>
                      {b.isPaid ? "✅ Paid" : "⏳ Pending"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

const s = {
  page: { padding: 32 },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: { margin: 0, fontSize: 26, fontWeight: 800, color: "#1e1b4b" },
  sub: { color: "#6b7280", fontSize: 13, marginTop: 4 },
  addBtn: {
    background: "linear-gradient(135deg,#ff6b35,#e55a28)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "11px 22px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    boxShadow: "0 4px 16px rgba(255,107,53,0.35)",
    transition: "transform .2s",
  },
  msg: {
    borderRadius: 12,
    padding: "12px 16px",
    marginBottom: 20,
    fontWeight: 500,
    fontSize: 14,
  },
  msgSuccess: {
    background: "#d1fae5",
    color: "#065f46",
    border: "1px solid #6ee7b7",
  },
  msgError: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fca5a5",
  },
  formCard: {
    background: "#fff",
    borderRadius: 16,
    padding: 28,
    marginBottom: 24,
  },
  formTitle: {
    margin: "0 0 20px",
    fontSize: 18,
    fontWeight: 700,
    color: "#1e1b4b",
  },
  row: { display: "flex", gap: 16 },
  field: { marginBottom: 16 },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    border: "2px solid #e5e7eb",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 14,
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color .2s",
    fontFamily: "inherit",
  },
  formBtns: { display: "flex", gap: 10 },
  saveBtn: {
    background: "linear-gradient(135deg,#4f46e5,#4338ca)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 24px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
  },
  cancelBtn: {
    background: "#f3f4f6",
    color: "#374151",
    border: "none",
    borderRadius: 10,
    padding: "10px 24px",
    cursor: "pointer",
    fontWeight: 500,
  },
  tableWrap: { overflow: "hidden", borderRadius: 16 },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "linear-gradient(90deg,#1e1b4b,#2d3561)" },
  th: {
    padding: "14px 16px",
    color: "rgba(255,255,255,0.85)",
    textAlign: "left",
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  td: { padding: "13px 16px", fontSize: 14, borderBottom: "1px solid #f3f4f6" },
  ordBadge: {
    background: "#ede9fe",
    color: "#5b21b6",
    borderRadius: 8,
    padding: "3px 9px",
    fontSize: 13,
    fontWeight: 600,
  },
  empty: { textAlign: "center", padding: 40, color: "#9ca3af", fontSize: 15 },
  badgeGreen: {
    background: "#d1fae5",
    color: "#065f46",
    borderRadius: 20,
    padding: "4px 12px",
    fontSize: 12,
    fontWeight: 600,
  },
  badgeYellow: {
    background: "#fef3c7",
    color: "#92400e",
    borderRadius: 20,
    padding: "4px 12px",
    fontSize: 12,
    fontWeight: 600,
  },
};
