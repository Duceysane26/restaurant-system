import React, { useEffect, useState } from "react";
import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
} from "../services/api";
import Pagination from "../components/Pagination";
import TableForm from "../components/forms/TableForm";
import TablePills from "../components/TablePills";

const PAGE_SIZE = 6;
const empty = {
  tableId: 0,
  tableNumber: "",
  capacity: "",
  location: "",
  status: "Available",
};
const statuses = ["Available", "Occupied", "Reserved", "Maintenance"];
const statusCfg = {
  Available: { bg: "#d1fae5", color: "#065f46", icon: "🟢" },
  Occupied: { bg: "#fee2e2", color: "#991b1b", icon: "🔴" },
  Reserved: { bg: "#fef3c7", color: "#92400e", icon: "🟡" },
  Maintenance: { bg: "#e5e7eb", color: "#374151", icon: "⚙️" },
};

export default function TablesPage() {
  const [all, setAll] = useState([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState({ text: "", type: "" });

  const load = async () => {
    try {
      const r = await getTables();
      setAll(r.data.data || []);
    } catch {}
  };
  useEffect(() => {
    load();
  }, []);

  const filtered = all.filter((t) => filter === "" || t.status === filter);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const flash = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  const validate = () => {
    const e = {};
    if (!form.tableNumber || isNaN(form.tableNumber))
      e.tableNumber = "Valid table number required";
    if (!form.capacity || isNaN(form.capacity) || Number(form.capacity) < 1)
      e.capacity = "Valid capacity required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const payload = {
        ...form,
        tableNumber: Number(form.tableNumber),
        capacity: Number(form.capacity),
      };
      if (editing) await updateTable(payload);
      else await createTable(payload);
      flash(editing ? "Table updated!" : "Table created!");
      setShowForm(false);
      setForm(empty);
      setEditing(false);
      load();
    } catch (err) {
      flash(err.response?.data?.message || "Error", "error");
    }
  };

  const handleEdit = (t) => {
    setForm({
      ...t,
      tableNumber: String(t.tableNumber),
      capacity: String(t.capacity),
    });
    setEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this table?")) return;
    try {
      await deleteTable(id);
      flash("Deleted!");
      load();
    } catch {}
  };

  return (
    <div style={s.page}>
      <div style={s.header} className="animate-fade">
        <div>
          <h2 style={s.title}>🪑 Tables</h2>
          <p style={s.sub}>{all.length} tables total</p>
        </div>
        <button
          style={s.addBtn}
          onClick={() => {
            setForm(empty);
            setEditing(false);
            setShowForm(true);
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-2px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          + Add Table
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

      {/* Wacitaanka TableForm Component */}
      {showForm && (
        <TableForm
          form={form}
          setForm={setForm}
          errors={errors}
          editing={editing}
          statuses={statuses}
          handleSubmit={handleSubmit}
          setShowForm={setShowForm}
          s={s}
        />
      )}

      {/* Wacitaanka TablePills Component */}
      <TablePills
        filter={filter}
        setFilter={setFilter}
        statuses={statuses}
        statusCfg={statusCfg}
        all={all}
        setPage={setPage}
        s={s}
      />

      <div style={s.grid}>
        {paged.length === 0 ? (
          <div style={s.empty}>No tables found 📭</div>
        ) : (
          paged.map((t, i) => {
            const cfg = statusCfg[t.status] || statusCfg.Available;
            return (
              <div
                key={t.tableId}
                style={{
                  ...s.tableCard,
                  borderTop: `4px solid ${cfg.color}`,
                  animationDelay: `${i * 0.06}s`,
                }}
                className="animate-fade card"
              >
                <div style={s.tableNum}>Table {t.tableNumber}</div>
                <div style={s.tableCap}>👥 {t.capacity} persons</div>
                {t.location && <div style={s.tableLoc}>📍 {t.location}</div>}
                <span
                  style={{ ...s.badge, background: cfg.bg, color: cfg.color }}
                >
                  {cfg.icon} {t.status}
                </span>
                <div style={s.tableActions}>
                  <button style={s.editBtn} onClick={() => handleEdit(t)}>
                    ✏️ Edit
                  </button>
                  <button
                    style={s.delBtn}
                    onClick={() => handleDelete(t.tableId)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })
        )}
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
  pills: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  pill: {
    background: "#f3f4f6",
    border: "2px solid transparent",
    borderRadius: 20,
    padding: "7px 16px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    transition: "all .2s",
    fontFamily: "inherit",
  },
  pillActive: {
    background: "#1e1b4b",
    color: "#fff",
    border: "2px solid #1e1b4b",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
    gap: 16,
    marginBottom: 16,
  },
  tableCard: {
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    transition: "transform .2s,box-shadow .2s",
    cursor: "default",
  },
  tableNum: {
    fontSize: 18,
    fontWeight: 800,
    color: "#1e1b4b",
    marginBottom: 6,
  },
  tableCap: { fontSize: 13, color: "#6b7280", marginBottom: 4 },
  tableLoc: { fontSize: 13, color: "#6b7280", marginBottom: 10 },
  badge: {
    borderRadius: 20,
    padding: "4px 12px",
    fontSize: 12,
    fontWeight: 600,
    display: "inline-block",
    marginBottom: 12,
  },
  tableActions: { display: "flex", gap: 6, marginTop: 4 },
  empty: {
    textAlign: "center",
    padding: 40,
    color: "#9ca3af",
    fontSize: 15,
    gridColumn: "1/-1",
  },
  editBtn: {
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "none",
    borderRadius: 8,
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    flex: 1,
  },
  delBtn: {
    background: "#fff0f0",
    color: "#dc2626",
    border: "none",
    borderRadius: 8,
    padding: "6px 10px",
    cursor: "pointer",
    fontSize: 13,
  },
};
