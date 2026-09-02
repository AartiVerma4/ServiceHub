import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api";
import { io } from "socket.io-client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("servicehub_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("servicehub_token") || "");
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Theme State Persistence ('dark' | 'light')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("servicehub_theme") || "dark";
  });

  useEffect(() => {
    localStorage.setItem("servicehub_theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Language State Persistence ('en' | 'hi')
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("servicehub_lang") || "en";
  });

  useEffect(() => {
    localStorage.setItem("servicehub_lang", lang);
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "hi" : "en"));
  };

  // Cart State Persistence
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("servicehub_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("servicehub_cart", JSON.stringify(cart));
  }, [cart]);

  // Connect Socket.io
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || (import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace("/api", "") : "http://localhost:5000");
    const newSocket = io(socketUrl, { autoConnect: true });
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  // Sync Current User Profile
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await api.get("/auth/me");
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem("servicehub_user", JSON.stringify(res.data.user));
          }
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = (tokenData, userData) => {
    setToken(tokenData);
    setUser(userData);
    localStorage.setItem("servicehub_token", tokenData);
    localStorage.setItem("servicehub_user", JSON.stringify(userData));
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("servicehub_token");
    localStorage.removeItem("servicehub_user");
  };

  // Cart Methods
  const addToCart = (service) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.service._id === service._id);
      if (exists) {
        return prev.map((item) =>
          item.service._id === service._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { service, quantity: 1 }];
    });
  };

  const removeFromCart = (serviceId) => {
    setCart((prev) => prev.filter((item) => item.service._id !== serviceId));
  };

  const clearCart = () => setCart([]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        socket,
        loading,
        theme,
        toggleTheme,
        lang,
        toggleLang,
        login,
        logout,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
