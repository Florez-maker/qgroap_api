import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  let user_loggin = localStorage.getItem("user");

  if (!user_loggin) {
    user_loggin = null;
  }

  console.log(user_loggin);

  const [user, setUser] = useState(user_loggin ? JSON.parse(user_loggin) : null);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
