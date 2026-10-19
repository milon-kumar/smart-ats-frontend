import { useState, useEffect } from "react";
import { useApiQuery, useApiMutation } from "@/hooks/useApi";

export const useAuth = () => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const {
    data: currentUserData,
    isLoading: isFetchingUser,
    refetch: fetchUser,
  } = useApiQuery({
    url: "/me",
    enabled: !!token,
  });

  useEffect(() => {
    if (currentUserData?.data) {
      setUser(currentUserData.data);
      localStorage.setItem("user", JSON.stringify(currentUserData.data));
    }
  }, [currentUserData]);

  const loginMutation = useApiMutation({
    url: "/login",
    method: "POST",
  });

  const logoutMutation = useApiMutation({
    url: "/logout",
    method: "POST",
  });

  const registerMutation = useApiMutation({
    url: "/register",
    method: "POST",
  });

  const login = async (credentials) => {
    try {
      const response = await loginMutation.mutateAsync({ data: credentials });
      if (response?.status === "success" && response?.data) {
        const authToken = response.data.token;
        const authUser = response.data.user;

        localStorage.setItem("token", authToken);
        localStorage.setItem("user", JSON.stringify(authUser));

        setToken(authToken);
        setUser(authUser);
      }
      return response;
    } catch (error) {
      throw error?.response?.data || error;
    }
  };

  const register = async (data) => {
    try {
      const response = await registerMutation.mutateAsync({ data });
      if (response?.status === "success" && response?.data) {
        const authToken = response.data.token;
        const authUser = response.data.user;

        localStorage.setItem("token", authToken);
        localStorage.setItem("user", JSON.stringify(authUser));

        setToken(authToken);
        setUser(authUser);
      }
      return response;
    } catch (error) {
      throw error?.response?.data || error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        return await logoutMutation.mutateAsync({});
      }
    } catch (e) {
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    }
  };

  return {
    user,
    token,
    role: user?.role ?? null,
    isAuthenticated: !!token,

    login,
    register,
    logout,
    fetchUser,

    isLoading:
      loginMutation.isPending ||
      logoutMutation.isPending ||
      registerMutation.isPending ||
      isFetchingUser,

    loginError: loginMutation.error?.response?.data || null,
    registerError: registerMutation.error?.response?.data || null,
  };
};
