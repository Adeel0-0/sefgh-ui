"use client";

import { ThemeProvider } from "./theme-provider";
import { AppProvider } from "@/contexts/app-context";
import { ToastProvider } from "@/components/ui/toast";

export function RootProviders({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
