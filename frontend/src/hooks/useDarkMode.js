import { useEffect } from "react";

const THEME_KEY = "resumeiq_theme";

export default function useDarkMode() {
  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;

    root.classList.toggle("dark", shouldUseDark);
  }, []);
}

export function toggleTheme() {
  const root = document.documentElement;
  const nextIsDark = !root.classList.contains("dark");

  root.classList.toggle("dark", nextIsDark);
  localStorage.setItem(THEME_KEY, nextIsDark ? "dark" : "light");

  return nextIsDark;
}
