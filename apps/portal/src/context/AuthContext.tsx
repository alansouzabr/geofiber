"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AuthCompany = {
  id: string;
  name: string;
  personType?: string | null;
  isActive?: boolean;
};

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;

  role?: string | null;

  permissions?: string[];

  companyId?: string | null;

  company?: AuthCompany | null;

  companyName?: string | null;

  isActive?: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;

  refreshUser: () => Promise<void>;

  logout: () => void;
};

export const AuthContext =
  createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  const refreshUser =
    useCallback(async () => {
      const token =
        localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        console.error(
          "NEXT_PUBLIC_API_URL não configurada."
        );

        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response =
          await fetch(
            `${apiUrl}/auth/me`,
            {
              method: "GET",
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            `AUTH_ME_${response.status}`
          );
        }

        const data =
          await response.json();

        setUser(data);
      } catch (error) {
        console.error(
          "AUTH /ME ERROR:",
          error
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const logout =
    useCallback(() => {
      localStorage.removeItem(
        "token"
      );

      document.cookie =
        "gf_token=; path=/; max-age=0";

      document.cookie =
        "token=; path=/; max-age=0";

      setUser(null);

      window.location.href =
        "/login";
    }, []);

  const value =
    useMemo(
      () => ({
        user,
        loading,
        refreshUser,
        logout,
      }),
      [
        user,
        loading,
        refreshUser,
        logout,
      ]
    );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}
