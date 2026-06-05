import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { toggleTheme } from "../hooks/useDarkMode.js";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  return (
    <button
      type="button"
      onClick={() => setDark(toggleTheme())}
      className="btn-secondary h-10 w-10 px-0"
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
