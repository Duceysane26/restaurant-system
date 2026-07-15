import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/api";
import Pagination from "../components/Pagination";
import CategoryForm from "../components/forms/CategoryForm"; // Halkan ayaan soo gashanney Component-gii cusbaa

const PAGE_SIZE = 5;
const empty = {
  categoryId: 0,
  categoryName: "",
  description: "",
  isActive: true,
};

export default function CategoriesPage() {
  const [all, setAll] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState({ text: "", type: "" });

  const load = async () => {
    try {
      const r = await getCategories();
      setAll(r.data.data || []);
    } catch {}
  };
  useEffect(() => {
    load();
  }, []);

  const filtered = all.filter((c) =>
    c.categoryName.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const flash = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  const validate = () => {
    const e = {};
    if (!form.categoryName.trim()) e.categoryName = "Category name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (editing) await updateCategory(form);
      else await createCategory(form);
      flash(editing ? "Category updated!" : "Category created!");
      setShowForm(false);
      setForm(empty);
      setEditing(false);
      load();
    } catch (err) {
      flash(err.response?.data?.message || "Error", "error");
    }
  };

  const handleEdit = (c) => {
    setForm(c);
    setEditing(true);
    setShowForm(true);
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
      flash("Deleted!");
      load();
    } catch {}
  };

  return (
    <div style={s.page}>
      <div style={s.header} className="animate-fade">
        <div>
          <h2 style={s.title}>📂 Categories</h2>
          <p style={s.sub}>{all.length} categories total</p>
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
          + Add Category
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

      {/* Form-kii halkan ayaan ugu wagnay asagoo nadiif ah props-na ugu baasnay */}
      {showForm && (
        <CategoryForm
          form={form}
          setForm={setForm}
          editing={editing}
          handleSubmit={handleSubmit}
          setShowForm={setShowForm}
          errors={errors}
          s={s}
        />
      )}

      <div style={s.searchWrap}>
        <span style={s.searchIcon}>🔍</span>
        <input
          style={s.search}
          placeholder="Search categories..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div style={s.tableWrap} className="card">
        <table style={s.table}>
          <thead>
            <tr style={s.thead}>
              <th style={s.th}>#</th>
              <th style={s.th}>Name</th>
              <th style={s.th}>Description</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={5} style={s.empty}>
                  No categories found 📭
                </td>
              </tr>
            ) : (
              paged.map((c, i) => (
                <tr
                  key={c.categoryId}
                  className="animate-fade"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <td style={s.td}>
                    <span style={s.num}>{(page - 1) * PAGE_SIZE + i + 1}</span>
                  </td>
                  <td style={s.td}>
                    <strong style={{ color: "#1e1b4b" }}>
                      {c.categoryName}
                    </strong>
                  </td>
                  <td style={s.td}>
                    <span style={s.desc}>{c.description || "—"}</span>
                  </td>
                  <td style={s.td}>
                    <span style={c.isActive ? s.badgeGreen : s.badgeRed}>
                      {c.isActive ? "✅ Active" : "❌ Inactive"}
                    </span>
                  </td>
                  <td style={s.td}>
                    <button style={s.editBtn} onClick={() => handleEdit(c)}>
                      ✏️ Edit
                    </button>
                    <button
                      style={s.delBtn}
                      onClick={() => handleDelete(c.categoryId)}
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
    transition: "transform .2s,box-shadow .2s",
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
  searchWrap: { position: "relative", marginBottom: 16 },
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
    transition: "border-color .2s",
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
  desc: { color: "#6b7280" },
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
    fontSize: 13,
  },
};
