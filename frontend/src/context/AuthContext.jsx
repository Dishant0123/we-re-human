import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('werehuman_user');
      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Local storage error caught and fixed:", error);
      localStorage.removeItem('werehuman_user'); 
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('werehuman_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('werehuman_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};