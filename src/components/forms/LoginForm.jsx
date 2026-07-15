import React from "react";

export default function LoginForm({
  form,
  handleChange,
  handleSubmit,
  loading,
  s,
}) {
  return (
    <form onSubmit={handleSubmit}>
      <div style={s.field} className="animate-fade">
        <label style={s.label}>Username</label>
        <div style={s.inputWrap}>
          <span style={s.inputIcon}>👤</span>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            style={s.input}
            placeholder="Enter username"
            autoComplete="username"
          />
        </div>
      </div>

      <div
        style={{ ...s.field, animationDelay: ".08s" }}
        className="animate-fade"
      >
        <label style={s.label}>Password</label>
        <div style={s.inputWrap}>
          <span style={s.inputIcon}>🔒</span>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            style={s.input}
            placeholder="Enter password"
            autoComplete="current-password"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={s.btn}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translateY(-2px)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "translateY(0)")
        }
      >
        {loading ? <span style={s.spinner} /> : "🚀 Sign In"}
      </button>
    </form>
  );
}
