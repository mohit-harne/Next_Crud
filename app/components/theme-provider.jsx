"use client"

import React, { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }) {
  const [mounted, setMounted] = useState(false);

  // Ensures the component is only rendered on the client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // If not mounted, return null (or you could return a fallback UI)
    return null;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
