import React, { useEffect, useState } from "react";
import {
  getOrders,
  getTables,
  getMenuItems,
  createOrder,
  updateOrderStatus,
  cancelOrder,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";
import OrderForm from "../components/forms/OrderForm";
import OrderFilters from "../components/OrderFilters";

const PAGE_SIZE = 5;
const statusCfg = {
  Pending: { bg: "#fef3c7", color: "#92400e", icon: "⏳" },
  InProgress: { bg: "#dbeafe", color: "#1e40af", icon: "🔄" },
  Completed: { bg: "#d1fae5", color: "#065f46", icon: "✅" },
  Cancelled: { bg: "#fee2e2", color: "#991b1b", icon: "❌" },
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    tableId: "",
    notes: "",
    items: [{ menuItemId: "", quantity: 1, notes: "" }],
  });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState({ text: "", type: "" });

  const load = async () => {
    try {
      const [o, t, m] = await Promise.all([
        getOrders(),
        getTables(),
        getMenuItems(),
      ]);
      setOrders(o.data.data || []);
      setTables((t.data.data || []).filter((t) => t.status === "Available"));
      setMenuItems((m.data.data || []).filter((m) => m.isAvailable));
    } catch {}
  };
  useEffect(() => {
    load();
  }, []);

  const filtered = orders.filter(
    (o) =>
      (filterStatus === "" || o.status === filterStatus) &&
      (search === "" || String(o.orderId).includes(search)),
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const flash = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  const addItem = () =>
    setForm({
      ...form,
      items: [...form.items, { menuItemId: "", quantity: 1, notes: "" }],
    });
  const removeItem = (i) =>
    setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });
  const updateItem = (i, key, val) => {
    const items = [...form.items];
    items[i] = { ...items[i], [key]: val };
    setForm({ ...form, items });
  };

  const validate = () => {
    const e = {};
    if (!form.tableId) e.tableId = "Table is required";
    if (form.items.some((it) => !it.menuItemId))
      e.items = "All items must have a menu item selected";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await createOrder({
        tableId: Number(form.tableId),
        waiterId: user.userId,
        notes: form.notes,
        items: form.items.map((it) => ({
          menuItemId: Number(it.menuItemId),
          quantity: Number(it.quantity),
          notes: it.notes,
        })),
      });
      flash("Order created!");
      setShowForm(false);
      setForm({
        tableId: "",
        notes: "",
        items: [{ menuItemId: "", quantity: 1, notes: "" }],
      });
      load();
    } catch (err) {
      flash(err.response?.data?.message || "Error", "error");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      flash("Status updated!");
      load();
    } catch {}
  };
  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await cancelOrder(id);
      flash("Order cancelled!");
      load();
    } catch {}
  };

  return (
    <div style={s.page}>
      <div style={s.header} className="animate-fade">
        <div>
          <h2 style={s.title}>📋 Orders</h2>
          <p style={s.sub}>{orders.length} orders total</p>
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
          + New Order
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

      {/* Wacitaanka OrderForm Component */}
      {showForm && (
        <OrderForm
          form={form}
          setForm={setForm}
          tables={tables}
          menuItems={menuItems}
          errors={errors}
          handleSubmit={handleSubmit}
          setShowForm={setShowForm}
          addItem={addItem}
          removeItem={removeItem}
          updateItem={updateItem}
          s={s}
        />
      )}

      {/* Wacitaanka OrderFilters Component */}
      <OrderFilters
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        statusCfg={statusCfg}
        setPage={setPage}
        s={s}
      />

      <div style={s.tableWrap} className="card">
        <table style={s.table}>
          <thead>
            <tr style={s.thead}>
              <th style={s.th}>Order ID</th>
              <th style={s.th}>Table</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Date</th>
              <th style={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={5} style={s.empty}>
                  No orders found 📭
                </td>
              </tr>
            ) : (
              paged.map((o, i) => {
                const cfg = statusCfg[o.status] || statusCfg.Pending;
                return (
                  <tr
                    key={o.orderId}
                    className="animate-fade"
                    style={{ animationDelay: `${i * 0.04}s` }}
                  >
                    <td style={s.td}>
                      <strong style={{ color: "#4f46e5", fontSize: 16 }}>
                        #{o.orderId}
                      </strong>
                    </td>
                    <td style={s.td}>
                      <span style={s.tableBadge}>Table {o.tableId}</span>
                    </td>
                    <td style={s.td}>
                      <span
                        style={{
                          ...s.badge,
                          background: cfg.bg,
                          color: cfg.color,
                        }}
                      >
                        {cfg.icon} {o.status}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={{ color: "#6b7280", fontSize: 13 }}>
                        {new Date(o.orderDate).toLocaleString()}
                      </span>
                    </td>
                    <td style={s.td}>
                      {o.status === "Pending" && (
                        <button
                          style={s.editBtn}
                          onClick={() =>
                            handleStatusChange(o.orderId, "InProgress")
                          }
                        >
                          ▶ In Progress
                        </button>
                      )}
                      {o.status === "InProgress" && (
                        <button
                          style={{
                            ...s.editBtn,
                            background: "#d1fae5",
                            color: "#065f46",
                          }}
                          onClick={() =>
                            handleStatusChange(o.orderId, "Completed")
                          }
                        >
                          ✅ Complete
                        </button>
                      )}
                      {(o.status === "Pending" ||
                        o.status === "InProgress") && (
                        <button
                          style={s.delBtn}
                          onClick={() => handleCancel(o.orderId)}
                        >
                          ✕ Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
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
  inputErr: { borderColor: "#ef4444" },
  errText: { color: "#ef4444", fontSize: 12, marginTop: 4, display: "block" },
  itemsHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "8px 0 12px",
  },
  itemsTitle: { margin: 0, fontSize: 15, fontWeight: 700, color: "#1e1b4b" },
  itemRow: { display: "flex", gap: 10, alignItems: "center", marginBottom: 10 },
  removeBtn: {
    background: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: 8,
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: 700,
    flexShrink: 0,
  },
  addItemBtn: {
    background: "#f0fdf4",
    color: "#16a34a",
    border: "2px dashed #86efac",
    borderRadius: 10,
    padding: "9px 18px",
    cursor: "pointer",
    fontWeight: 600,
    marginBottom: 20,
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
  filters: { display: "flex", gap: 12, marginBottom: 16 },
  searchWrap: { position: "relative", flex: 2 },
  searchIcon: {
    position: "absolute",
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 16,
    pointerEvents: "none",
  },
  search: {
    width: "100%",
    border: "2px solid #e5e7eb",
    borderRadius: 12,
    padding: "11px 14px 11px 42px",
    fontSize: 14,
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "inherit",
  },
  filterSelect: {
    flex: 1,
    border: "2px solid #e5e7eb",
    borderRadius: 12,
    padding: "11px 14px",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
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
  tableBadge: {
    background: "#ede9fe",
    color: "#5b21b6",
    borderRadius: 8,
    padding: "4px 10px",
    fontSize: 13,
    fontWeight: 600,
  },
  badge: {
    borderRadius: 20,
    padding: "4px 12px",
    fontSize: 12,
    fontWeight: 600,
  },
  empty: { textAlign: "center", padding: 40, color: "#9ca3af", fontSize: 15 },
  editBtn: {
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "none",
    borderRadius: 8,
    padding: "6px 12px",
    cursor: "pointer",
    marginRight: 6,
    fontSize: 12,
    fontWeight: 600,
  },
  delBtn: {
    background: "#fff0f0",
    color: "#dc2626",
    border: "none",
    borderRadius: 8,
    padding: "6px 10px",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
  },
};
