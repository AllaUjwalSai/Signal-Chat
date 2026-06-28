"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext =
  createContext<ThemeContextType | null>(
    null
  );

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] =
    useState<Theme>("light");

  useEffect(() => {
    const saved =
      localStorage.getItem("theme") as Theme | null;

    const current = saved ?? "light";

    setTheme(current);

    document.documentElement.classList.toggle(
      "dark",
      current === "dark"
    );
  }, []);

  function toggleTheme() {
    const next =
      theme === "light"
        ? "dark"
        : "light";

    setTheme(next);

    document.documentElement.classList.toggle(
      "dark",
      next === "dark"
    );

    localStorage.setItem(
      "theme",
      next
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}