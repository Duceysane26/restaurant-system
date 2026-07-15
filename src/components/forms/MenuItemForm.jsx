import React from "react";

export default function MenuItemForm({
  form,
  setForm,
  categories,
  errors,
  editing,
  handleSubmit,
  setShowForm,
  s,
}) {
  return (
    <div style={s.formCard} className="animate-slide card">
      <h3 style={s.formTitle}>
        {editing ? "✏️ Edit Menu Item" : "➕ New Menu Item"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div style={s.row}>
          <div style={{ ...s.field, flex: 1 }}>
            <label style={s.label}>Item Name *</label>
            <input
              style={{ ...s.input, ...(errors.itemName ? s.inputErr : {}) }}
              value={form.itemName}
              onChange={(e) => setForm({ ...form, itemName: e.target.value })}
              placeholder="e.g. Beef Rice"
            />
            {errors.itemName && (
              <span style={s.errText}>{errors.itemName}</span>
            )}
          </div>
          <div style={{ ...s.field, flex: 1 }}>
            <label style={s.label}>Category *</label>
            <select
              style={{ ...s.input, ...(errors.categoryId ? s.inputErr : {}) }}
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.categoryName}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <span style={s.errText}>{errors.categoryId}</span>
            )}
          </div>
        </div>
        <div style={s.row}>
          <div style={{ ...s.field, flex: 1 }}>
            <label style={s.label}>Price ($) *</label>
            <input
              style={{ ...s.input, ...(errors.price ? s.inputErr : {}) }}
              value={form.price}
              type="number"
              step="0.01"
              min="0"
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0.00"
            />
            {errors.price && <span style={s.errText}>{errors.price}</span>}
          </div>
          <div style={{ ...s.field, flex: 2 }}>
            <label style={s.label}>Description</label>
            <input
              style={s.input}
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Optional description"
            />
          </div>
        </div>
        <label style={s.checkLabel}>
          <input
            type="checkbox"
            checked={form.isAvailable}
            onChange={(e) =>
              setForm({ ...form, isAvailable: e.target.checked })
            }
            style={s.checkbox}
          />
          Available
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
