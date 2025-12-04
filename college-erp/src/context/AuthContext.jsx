import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  //  Load saved login on refresh
  useEffect(() => {
    const saved = localStorage.getItem("cp_user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = ({ name, role }) => {
    const u = { name, role };
    setUser(u);
    localStorage.setItem("cp_user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cp_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
