import React from "react";

export default function TableForm({
  form,
  setForm,
  errors,
  editing,
  statuses,
  handleSubmit,
  setShowForm,
  s,
}) {
  return (
    <div style={s.formCard} className="animate-slide card">
      <h3 style={s.formTitle}>{editing ? "✏️ Edit Table" : "➕ New Table"}</h3>
      <form onSubmit={handleSubmit}>
        <div style={s.row}>
          <div style={{ ...s.field, flex: 1 }}>
            <label style={s.label}>Table Number *</label>
            <input
              style={{ ...s.input, ...(errors.tableNumber ? s.inputErr : {}) }}
              type="number"
              value={form.tableNumber}
              onChange={(e) =>
                setForm({ ...form, tableNumber: e.target.value })
              }
              placeholder="e.g. 5"
            />
            {errors.tableNumber && (
              <span style={s.errText}>{errors.tableNumber}</span>
            )}
          </div>
          <div style={{ ...s.field, flex: 1 }}>
            <label style={s.label}>Capacity *</label>
            <input
              style={{ ...s.input, ...(errors.capacity ? s.inputErr : {}) }}
              type="number"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              placeholder="e.g. 4"
            />
            {errors.capacity && (
              <span style={s.errText}>{errors.capacity}</span>
            )}
          </div>
          <div style={{ ...s.field, flex: 1 }}>
            <label style={s.label}>Location</label>
            <input
              style={s.input}
              value={form.location || ""}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Indoor / VIP / Outdoor"
            />
          </div>
        </div>
        {editing && (
          <div style={s.field}>
            <label style={s.label}>Status</label>
            <select
              style={s.input}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        )}
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
