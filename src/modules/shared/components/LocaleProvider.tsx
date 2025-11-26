"use client";

import { useEffect } from "react";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const locale = localStorage.getItem("locale") || "es";
    document.cookie = `locale=${locale}; path=/; max-age=31536000`; // 1 year
  }, []);

  return <>{children}</>;
}
