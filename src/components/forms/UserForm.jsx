import React from "react";

export default function UserForm({
  form,
  setForm,
  editing,
  handleSubmit,
  setShowForm,
  errors,
  emptyUser,
  s,
}) {
  return (
    <div style={s.formCard} className="animate-slide card">
      <h3 style={s.formTitle}>{editing ? "✏️ Edit User" : "➕ New User"}</h3>
      <form onSubmit={handleSubmit}>
        <div style={s.row}>
          <div style={{ ...s.field, flex: 1 }}>
            <label style={s.label}>Full Name *</label>
            <input
              style={{ ...s.input, ...(errors.fullName ? s.inputErr : {}) }}
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            {errors.fullName && (
              <span style={s.errText}>{errors.fullName}</span>
            )}
          </div>
          <div style={{ ...s.field, flex: 1 }}>
            <label style={s.label}>Username *</label>
            <input
              style={{ ...s.input, ...(errors.username ? s.inputErr : {}) }}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            {errors.username && (
              <span style={s.errText}>{errors.username}</span>
            )}
          </div>
        </div>
        <div style={s.row}>
          <div style={{ ...s.field, flex: 1 }}>
            <label style={s.label}>
              {editing ? "New Password" : "Password *"}
            </label>
            <input
              style={{ ...s.input, ...(errors.password ? s.inputErr : {}) }}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errors.password && (
              <span style={s.errText}>{errors.password}</span>
            )}
          </div>
          <div style={{ ...s.field, flex: 1 }}>
            <label style={s.label}>Email *</label>
            <input
              style={{ ...s.input, ...(errors.email ? s.inputErr : {}) }}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <span style={s.errText}>{errors.email}</span>}
          </div>
        </div>
        <div style={s.row}>
          <div style={{ ...s.field, flex: 1 }}>
            <label style={s.label}>Phone</label>
            <input
              style={s.input}
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div style={{ ...s.field, flex: 1 }}>
            <label style={s.label}>Role</label>
            <select
              style={s.input}
              value={form.roleName}
              onChange={(e) => setForm({ ...form, roleName: e.target.value })}
            >
              {["Admin", "Waiter", "Cashier", "Kitchen"].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div
            style={{
              ...s.field,
              flex: 1,
              display: "flex",
              alignItems: "flex-end",
              paddingBottom: 14,
            }}
          >
            <label style={{ ...s.checkLabel }}>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
                style={s.checkbox}
              />{" "}
              Active
            </label>
          </div>
        </div>
        <div style={s.formBtns}>
          <button type="submit" style={s.saveBtn}>
            💾 Save
          </button>
          <button
            type="button"
            style={s.cancelBtn}
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
