import React from "react";

export default function BillForm({
  form,
  setForm,
  completedOrders,
  handleSubmit,
  setShowForm,
  s,
}) {
  return (
    <div style={s.formCard} className="animate-slide card">
      <h3 style={s.formTitle}>🧾 Generate Bill</h3>
      <form onSubmit={handleSubmit}>
        <div style={s.row}>
          <div style={{ ...s.field, flex: 1 }}>
            <label style={s.label}>Order *</label>
            <select
              style={s.input}
              value={form.orderId}
              onChange={(e) => setForm({ ...form, orderId: e.target.value })}
            >
              <option value="">Select order</option>
              {completedOrders.map((o) => (
                <option key={o.orderId} value={o.orderId}>
                  Order #{o.orderId} — Table {o.tableId}
                </option>
              ))}
            </select>
          </div>
          <div style={{ ...s.field, flex: 1 }}>
            <label style={s.label}>Payment Method</label>
            <select
              style={s.input}
              value={form.paymentMethod}
              onChange={(e) =>
                setForm({ ...form, paymentMethod: e.target.value })
              }
            >
              <option>Cash</option>
              <option>Card</option>
              <option>Mobile</option>
            </select>
          </div>
        </div>
        <div style={s.row}>
          <div style={{ ...s.field, flex: 1 }}>
            <label style={s.label}>Tax Rate (%)</label>
            <input
              style={s.input}
              type="number"
              value={form.taxRate}
              onChange={(e) => setForm({ ...form, taxRate: e.target.value })}
            />
          </div>
          <div style={{ ...s.field, flex: 1 }}>
            <label style={s.label}>Discount ($)</label>
            <input
              style={s.input}
              type="number"
              value={form.discountAmount}
              onChange={(e) =>
                setForm({ ...form, discountAmount: e.target.value })
              }
            />
          </div>
        </div>
        <div style={s.formBtns}>
          <button type="submit" style={s.saveBtn}>
            🧾 Generate
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
