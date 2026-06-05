import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMe, loginUser, registerUser } from "../api/auth.js";
import { TOKEN_KEY } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const profile = await getMe();
    setUser(profile);
    return profile;
  }, []);

  const login = useCallback(
    async (credentials) => {
      const auth = await loginUser(credentials);
      localStorage.setItem(TOKEN_KEY, auth.access_token);
      setToken(auth.access_token);
      return refreshUser();
    },
    [refreshUser],
  );

  const register = useCallback(
    async (payload) => {
      await registerUser(payload);
      return login({ email: payload.email, password: payload.password });
    },
    [login],
  );

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return undefined;
    }

    let alive = true;

    getMe()
      .then((profile) => {
        if (alive) setUser(profile);
      })
      .catch(() => {
        if (alive) clearSession();
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [clearSession, token]);

  useEffect(() => {
    window.addEventListener("auth:logout", clearSession);
    return () => window.removeEventListener("auth:logout", clearSession);
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout: clearSession,
    }),
    [clearSession, loading, login, register, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
