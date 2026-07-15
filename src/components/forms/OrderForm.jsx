import React from "react";

export default function OrderForm({
  form,
  setForm,
  tables,
  menuItems,
  errors,
  handleSubmit,
  setShowForm,
  addItem,
  removeItem,
  updateItem,
  s,
}) {
  return (
    <div style={s.formCard} className="animate-slide card">
      <h3 style={s.formTitle}>🚀 New Order</h3>
      <form onSubmit={handleSubmit}>
        <div style={s.row}>
          <div style={{ ...s.field, flex: 1 }}>
            <label style={s.label}>Table *</label>
            <select
              style={{ ...s.input, ...(errors.tableId ? s.inputErr : {}) }}
              value={form.tableId}
              onChange={(e) => setForm({ ...form, tableId: e.target.value })}
            >
              <option value="">Select available table</option>
              {tables.map((t) => (
                <option key={t.tableId} value={t.tableId}>
                  Table {t.tableNumber} ({t.capacity} persons)
                  {t.location ? ` — ${t.location}` : ""}
                </option>
              ))}
            </select>
            {errors.tableId && <span style={s.errText}>{errors.tableId}</span>}
          </div>
          <div style={{ ...s.field, flex: 1 }}>
            <label style={s.label}>Notes</label>
            <input
              style={s.input}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Optional notes"
            />
          </div>
        </div>

        <div style={s.itemsHeader}>
          <h4 style={s.itemsTitle}>🍽️ Order Items</h4>
          {errors.items && <span style={s.errText}>{errors.items}</span>}
        </div>

        {form.items.map((item, i) => (
          <div key={i} style={s.itemRow}>
            <select
              style={{ ...s.input, flex: 3 }}
              value={item.menuItemId}
              onChange={(e) => updateItem(i, "menuItemId", e.target.value)}
            >
              <option value="">Select item</option>
              {menuItems.map((m) => (
                <option key={m.menuItemId} value={m.menuItemId}>
                  {m.itemName} — ${Number(m.price).toFixed(2)}
                </option>
              ))}
            </select>
            <input
              style={{ ...s.input, flex: 0.8, textAlign: "center" }}
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateItem(i, "quantity", e.target.value)}
              placeholder="Qty"
            />
            <input
              style={{ ...s.input, flex: 2 }}
              value={item.notes || ""}
              onChange={(e) => updateItem(i, "notes", e.target.value)}
              placeholder="e.g. No onions"
            />
            {form.items.length > 1 && (
              <button
                type="button"
                style={s.removeBtn}
                onClick={() => removeItem(i)}
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button type="button" style={s.addItemBtn} onClick={addItem}>
          + Add Item
        </button>

        <div style={s.formBtns}>
          <button type="submit" style={s.saveBtn}>
            🚀 Place Order
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
