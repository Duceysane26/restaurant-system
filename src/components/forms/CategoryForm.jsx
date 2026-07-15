import React from "react";

export default function CategoryForm({
  form,
  setForm,
  editing,
  handleSubmit,
  setShowForm,
  errors,
  s,
}) {
  return (
    <div style={s.formCard} className="animate-slide card">
      <h3 style={s.formTitle}>
        {editing ? "✏️ Edit Category" : "➕ New Category"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div style={s.field}>
          <label style={s.label}>Category Name *</label>
          <input
            style={{ ...s.input, ...(errors.categoryName ? s.inputErr : {}) }}
            value={form.categoryName}
            onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
            placeholder="e.g. Main Course"
          />
          {errors.categoryName && (
            <span style={s.errText}>{errors.categoryName}</span>
          )}
        </div>

        <div style={s.field}>
          <label style={s.label}>Description</label>
          <input
            style={s.input}
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Optional description"
          />
        </div>

        <label style={s.checkLabel}>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            style={s.checkbox}
          />
          Active
        </label>

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
