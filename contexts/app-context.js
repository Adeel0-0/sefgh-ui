"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState("welcome");
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load private mode state from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPrivateMode = localStorage.getItem("sefgh_private_mode");
      if (savedPrivateMode) {
        setIsPrivateMode(JSON.parse(savedPrivateMode));
      }
    }
  }, []);

  // Save private mode state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sefgh_private_mode", JSON.stringify(isPrivateMode));
    }
  }, [isPrivateMode]);

  const toggleSearchPanel = () => {
    setIsSearchPanelOpen(!isSearchPanelOpen);
  };

  const togglePrivateMode = () => {
    setIsPrivateMode(!isPrivateMode);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const value = {
    currentView,
    setCurrentView,
    isSearchPanelOpen,
    setIsSearchPanelOpen,
    toggleSearchPanel,
    isPrivateMode,
    setIsPrivateMode,
    togglePrivateMode,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    toggleMobileMenu,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
