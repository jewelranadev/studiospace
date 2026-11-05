"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

/**
 * Single global Sonner <Toaster /> for the whole app.
 *
 * The app toggles dark mode with a `.dark` class on <html> (not
 * prefers-color-scheme), so a MutationObserver keeps the toast theme in sync.
 */
export default function AppToaster() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const root = document.documentElement;

    const syncTheme = () => {
      setTheme(root.classList.contains("dark") ? "dark" : "light");
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return (
    <Toaster
      position="top-right"
      theme={theme}
      richColors
      closeButton
      offset={16}
      gap={12}
      toastOptions={{ duration: 4500 }}
      icons={{
        success: <CheckCircle2 size={18} />,
        error: <XCircle size={18} />,
        warning: <AlertTriangle size={18} />,
        info: <Info size={18} />,
      }}
    />
  );
}
