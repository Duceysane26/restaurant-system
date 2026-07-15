import React, { useEffect, useState } from "react";
import {
  getMenuItems,
  getCategories,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../services/api";
import Pagination from "../components/Pagination";
import MenuItemForm from "../components/forms/MenuItemForm";
import MenuFilters from "../components/MenuFilters";

const PAGE_SIZE = 6;
const empty = {
  menuItemId: 0,
  categoryId: "",
  itemName: "",
  description: "",
  price: "",
  isAvailable: true,
};

export default function MenuPage() {
  const [all, setAll] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState({ text: "", type: "" });

  const load = async () => {
    try {
      const [m, c] = await Promise.all([getMenuItems(), getCategories()]);
      setAll(m.data.data || []);
      setCategories(c.data.data || []);
    } catch {}
  };
  useEffect(() => {
    load();
  }, []);

  const filtered = all.filter(
    (m) =>
      m.itemName.toLowerCase().includes(search.toLowerCase()) &&
      (filterCat === "" || String(m.categoryId) === filterCat),
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const flash = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  const validate = () => {
    const e = {};
    if (!form.itemName.trim()) e.itemName = "Item name is required";
    if (!form.categoryId) e.categoryId = "Category is required";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      e.price = "Valid price is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const payload = {
        ...form,
        categoryId: Number(form.categoryId),
        price: Number(form.price),
      };
      if (editing) await updateMenuItem(payload);
      else await createMenuItem(payload);
      flash(editing ? "Item updated!" : "Item created!");
      setShowForm(false);
      setForm(empty);
      setEditing(false);
      load();
    } catch (err) {
      flash(err.response?.data?.message || "Error", "error");
    }
  };

  const handleEdit = (m) => {
    setForm({ ...m, price: String(m.price), categoryId: String(m.categoryId) });
    setEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await deleteMenuItem(id);
      flash("Deleted!");
      load();
    } catch {}
  };

  return (
    <div style={s.page}>
      <div style={s.header} className="animate-fade">
        <div>
          <h2 style={s.title}>🍔 Menu Items</h2>
          <p style={s.sub}>{all.length} items total</p>
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
          + Add Item
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

      {/* Wacitaanka Form-ka goonida ah */}
      {showForm && (
        <MenuItemForm
          form={form}
          setForm={setForm}
          categories={categories}
          errors={errors}
          editing={editing}
          handleSubmit={handleSubmit}
          setShowForm={setShowForm}
          s={s}
        />
      )}

      {/* Wacitaanka Qaybta Filters-ka iyo Raadinta */}
      <MenuFilters
        search={search}
        setSearch={setSearch}
        filterCat={filterCat}
        setFilterCat={setFilterCat}
        categories={categories}
        setPage={setPage}
        s={s}
      />

      <div style={s.tableWrap} className="card">
        <table style={s.table}>
          <thead>
            <tr style={s.thead}>
              <th style={s.th}>#</th>
              <th style={s.th}>Item</th>
              <th style={s.th}>Category</th>
              <th style={s.th}>Price</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={6} style={s.empty}>
                  No menu items found 📭
                </td>
              </tr>
            ) : (
              paged.map((m, i) => (
                <tr
                  key={m.menuItemId}
                  className="animate-fade"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <td style={s.td}>
                    <span style={s.num}>{(page - 1) * PAGE_SIZE + i + 1}</span>
                  </td>
                  <td style={s.td}>
                    <strong style={{ color: "#1e1b4b" }}>{m.itemName}</strong>
                    {m.description && (
                      <div
                        style={{ color: "#9ca3af", fontSize: 12, marginTop: 2 }}
                      >
                        {m.description}
                      </div>
                    )}
                  </td>
                  <td style={s.td}>
                    <span style={s.catBadge}>{m.categoryName}</span>
                  </td>
                  <td style={s.td}>
                    <strong style={{ color: "#059669", fontSize: 16 }}>
                      ${Number(m.price).toFixed(2)}
                    </strong>
                  </td>
                  <td style={s.td}>
                    <span style={m.isAvailable ? s.badgeGreen : s.badgeRed}>
                      {m.isAvailable ? "✅ Available" : "❌ Unavailable"}
                    </span>
                  </td>
                  <td style={s.td}>
                    <button style={s.editBtn} onClick={() => handleEdit(m)}>
                      ✏️
                    </button>
                    <button
                      style={s.delBtn}
                      onClick={() => handleDelete(m.menuItemId)}
                    >
                      🗑️
                    </button>
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
  inputErr: { borderColor: "#ef4444" },
  errText: { color: "#ef4444", fontSize: 12, marginTop: 4, display: "block" },
  checkLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    fontWeight: 500,
    color: "#374151",
    cursor: "pointer",
    marginBottom: 20,
  },
  checkbox: { width: 16, height: 16, accentColor: "#ff6b35" },
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
  num: {
    background: "#f3f4f6",
    color: "#6b7280",
    borderRadius: 6,
    padding: "2px 8px",
    fontSize: 12,
    fontWeight: 600,
  },
  catBadge: {
    background: "#ede9fe",
    color: "#5b21b6",
    borderRadius: 20,
    padding: "4px 12px",
    fontSize: 12,
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
  badgeRed: {
    background: "#fee2e2",
    color: "#991b1b",
    borderRadius: 20,
    padding: "4px 12px",
    fontSize: 12,
    fontWeight: 600,
  },
  editBtn: {
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "none",
    borderRadius: 8,
    padding: "6px 10px",
    cursor: "pointer",
    marginRight: 6,
    fontSize: 13,
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
