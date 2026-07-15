import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth(); // Waxaan soo gashanay 'loading' haddii uu Context-ka ku jiro

  // Haddii uu nidaamku weli soo kaxaynayo xogta isticmaalaha (App-ku markuu hadda dhasho)
  if (loading) {
    return (
      <div style={s.loadingContainer}>
        <div style={s.spinner}></div>
        <p style={s.loadingText}>Amniga ayaa la hubinayaa...</p>
      </div>
    );
  }

  // Haddii aan isticmaalahu jirin, u dhiib bogga Login-ka
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Haddii uu jiro is-maandhaaf dhanka doorarka ah (Roles), u dhiib Dashboard-ka cad
  if (roles && !roles.includes(user.roleName)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

const s = {
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#f8fafc",
    fontFamily: "inherit",
  },
  spinner: {
    width: 40,
    height: 40,
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #ff6b35",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748b",
    fontWeight: 500,
  },
};
