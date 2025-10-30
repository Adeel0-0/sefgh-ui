"use client";

import { ThemeProvider } from "./theme-provider";
import { AppProvider } from "@/contexts/app-context";
import { AuthProvider } from "@/contexts/auth-context";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";

export function RootProviders({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <AppProvider>
          <ToastProvider>
            {children}
            <Toaster />
          </ToastProvider>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
