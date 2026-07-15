import React, { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../services/api";
import Pagination from "../components/Pagination";
import UserForm from "../components/forms/UserForm"; // Waxaan soo gashanney Form-gii goonida ahaa

const PAGE_SIZE = 5;
const emptyUser = {
  userId: 0,
  fullName: "",
  username: "",
  password: "",
  email: "",
  phone: "",
  roleName: "Waiter",
  isActive: true,
};

export default function UsersPage() {
  const [all, setAll] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(emptyUser);
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState({ text: "", type: "" });

  const load = async () => {
    try {
      const r = await getUsers();
      setAll(r.data.data || []);
    } catch {}
  };
  useEffect(() => {
    load();
  }, []);

  const filtered = all.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const flash = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.username.trim()) e.username = "Username is required";
    if (!editing && !form.password) e.password = "Password is required";
    if (!form.email.trim()) e.email = "Email is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (editing) await updateUser(form);
      else await createUser(form);
      flash(editing ? "User updated!" : "User created!");
      setShowForm(false);
      setForm(emptyUser);
      setEditing(false);
      load();
    } catch (err) {
      flash(err.response?.data?.message || "Error", "error");
    }
  };

  const handleEdit = (u) => {
    setForm({ ...u, password: "" });
    setEditing(true);
    setShowForm(true);
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      flash("Deleted!");
      load();
    } catch {}
  };

  const roleColors = {
    Admin: { bg: "#fee2e2", color: "#991b1b" },
    Waiter: { bg: "#dbeafe", color: "#1e40af" },
    Cashier: { bg: "#d1fae5", color: "#065f46" },
    Kitchen: { bg: "#fef3c7", color: "#92400e" },
  };

  return (
    <div style={s.page}>
      <div style={s.header} className="animate-fade">
        <div>
          <h2 style={s.title}>👤 Users</h2>
          <p style={s.sub}>{all.length} users total</p>
        </div>
        <button
          style={s.addBtn}
          onClick={() => {
            setForm(emptyUser);
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
          + Add User
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

      {showForm && (
        <UserForm
          form={form}
          setForm={setForm}
          editing={editing}
          handleSubmit={handleSubmit}
          setShowForm={setShowForm}
          errors={errors}
          emptyUser={emptyUser}
          s={s}
        />
      )}

      <div style={s.searchWrap}>
        <span style={s.searchIcon}>🔍</span>
        <input
          style={s.search}
          placeholder="Search users..."
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
              <th style={s.th}>Name</th>
              <th style={s.th}>Username</th>
              <th style={s.th}>Email</th>
              <th style={s.th}>Role</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={6} style={s.empty}>
                  No users found 📭
                </td>
              </tr>
            ) : (
              paged.map((u, i) => {
                const rc = roleColors[u.roleName] || {
                  bg: "#f3f4f6",
                  color: "#374151",
                };
                return (
                  <tr
                    key={u.userId}
                    className="animate-fade"
                    style={{ animationDelay: `${i * 0.04}s` }}
                  >
                    <td style={s.td}>
                      <div style={s.userCell}>
                        <span style={s.avatar}>
                          {u.fullName[0].toUpperCase()}
                        </span>
                        <strong style={{ color: "#1e1b4b" }}>
                          {u.fullName}
                        </strong>
                      </div>
                    </td>
                    <td style={s.td}>
                      <span
                        style={{ color: "#6b7280", fontFamily: "monospace" }}
                      >
                        @{u.username}
                      </span>
                    </td>
                    <td style={s.td}>{u.email}</td>
                    <td style={s.td}>
                      <span
                        style={{
                          ...s.badge,
                          background: rc.bg,
                          color: rc.color,
                        }}
                      >
                        {u.roleName}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={u.isActive ? s.badgeGreen : s.badgeRed}>
                        {u.isActive ? "✅ Active" : "❌ Inactive"}
                      </span>
                    </td>
                    <td style={s.td}>
                      <button style={s.editBtn} onClick={() => handleEdit(u)}>
                        ✏️
                      </button>
                      <button
                        style={s.delBtn}
                        onClick={() => handleDelete(u.userId)}
                      >
                        🗑️
                      </button>
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
  checkLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    fontWeight: 500,
    color: "#374151",
    cursor: "pointer",
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
  userCell: { display: "flex", alignItems: "center", gap: 10 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifycenter: "center",
    fontWeight: 700,
    fontSize: 14,
    flexShrink: 0,
  },
  badge: {
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
