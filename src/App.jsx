import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import CategoriesPage from "./pages/CategoriesPage";
import MenuPage from "./pages/MenuPage";
import TablesPage from "./pages/TablesPage";
import OrdersPage from "./pages/OrdersPage";
import BillsPage from "./pages/BillsPage";
import UsersPage from "./pages/UsersPage";

// Layout-ku hadda wuxuu adeegsanayaa <Outlet /> si uu u rando gareeyo boggaga hoos yimaada
function Layout() {
  return (
    <div style={{ minHeight: "100vh", background: "#f5f6fa" }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        <Outlet />
      </div>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Bogga Login-ka */}
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      {/* Waddooyinka u baahan Badbaadada (ProtectedRoute) iyo Layout-ka unugga ah */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/tables" element={<TablesPage />} />
        <Route path="/orders" element={<OrdersPage />} />

        {/* Waddooyinka u baahan doorar gaar ah (Roles) */}
        <Route
          path="/bills"
          element={
            <ProtectedRoute roles={["Admin", "Cashier"]}>
              <BillsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Haddii la qoro xiriiriye aan jirin */}
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
