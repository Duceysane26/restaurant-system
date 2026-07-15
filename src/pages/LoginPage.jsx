import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/forms/LoginForm"; // Soo gasho Form-ka goonida ah

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await login(form);
      const userData = res.data.data;
      loginUser(userData, "no-token");
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Check username and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.bg1} />
      <div style={s.bg2} />
      <div style={s.bg3} />
      <div style={s.card} className="animate-pop">
        <div style={s.logoWrap}>
          <div style={s.logoCircle}>🍽️</div>
        </div>
        <h2 style={s.title}>Restaurant System</h2>
        <p style={s.subtitle}>Sign in to your account</p>

        {error && (
          <div style={s.error} className="animate-slide">
            ⚠️ {error}
          </div>
        )}

        {/* Halkaan waxaan ku wacnay LoginForm-kii nidaamsanaa */}
        <LoginForm
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          s={s}
        />
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #2d3561 100%)",
    backgroundSize: "400% 400%",
    animation: "gradientShift 8s ease infinite",
    position: "relative",
    overflow: "hidden",
  },
  bg1: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: "50%",
    background: "rgba(255,107,53,0.15)",
    top: -80,
    right: -80,
    animation: "pulse 4s ease-in-out infinite",
  },
  bg2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: "50%",
    background: "rgba(247,197,159,0.10)",
    bottom: 40,
    left: -60,
    animation: "pulse 5s ease-in-out infinite .5s",
  },
  bg3: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: "50%",
    background: "rgba(99,102,241,0.20)",
    top: "40%",
    right: "15%",
    animation: "pulse 6s ease-in-out infinite 1s",
  },
  card: {
    background: "rgba(255,255,255,0.97)",
    borderRadius: 24,
    padding: "44px 40px",
    width: 400,
    boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
    position: "relative",
    zIndex: 1,
    backdropFilter: "blur(8px)",
  },
  logoWrap: { textAlign: "center", marginBottom: 16 },
  logoCircle: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 72,
    height: 72,
    borderRadius: "50%",
    fontSize: 36,
    background: "linear-gradient(135deg,#ff6b35,#f7c59f)",
    boxShadow: "0 8px 24px rgba(255,107,53,0.35)",
    animation: "pulse 3s ease-in-out infinite",
  },
  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: 700,
    color: "#1e1b4b",
    marginBottom: 6,
  },
  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 14,
    marginBottom: 28,
  },
  error: {
    background: "#fff1f0",
    color: "#c0392b",
    border: "1px solid #fca5a5",
    borderRadius: 10,
    padding: "11px 14px",
    marginBottom: 20,
    fontSize: 13,
    fontWeight: 500,
  },
  field: { marginBottom: 18 },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 7,
  },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: {
    position: "absolute",
    left: 12,
    fontSize: 16,
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    border: "2px solid #e5e7eb",
    borderRadius: 10,
    padding: "11px 12px 11px 38px",
    fontSize: 14,
    outline: "none",
    transition: "border-color .2s, box-shadow .2s",
    fontFamily: "inherit",
  },
  btn: {
    width: "100%",
    background: "linear-gradient(135deg,#ff6b35,#e55a28)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "13px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 8,
    boxShadow: "0 6px 20px rgba(255,107,53,0.4)",
    transition: "transform .2s, box-shadow .2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  spinner: {
    width: 18,
    height: 18,
    border: "2px solid rgba(255,255,255,0.4)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin .7s linear infinite",
    display: "inline-block",
  },
};
