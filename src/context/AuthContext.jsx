import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Waxaan u oggolaanaynaa nidaamka inuu ku dhasho loading=true si loo hubiyo localStorage
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Marka uu App-ku dhasho, halkan ayaa laga hubinayaa haddii uu isticmaale hore u jiray
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Xogta localStorage waa laga waayay:", error);
    } finally {
      // Marka hubintu dhammaato, loading-ka waa la daminayaa
      setLoading(false);
    }
  }, []);

  const loginUser = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Waxaa fiican in la tirtiro kaliya xogta la ogyahay halkii la isticmaali lahaa localStorage.clear()
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
