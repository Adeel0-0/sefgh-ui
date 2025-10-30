"use client";

import { createContext, useContext, useState, useEffect } from "react";
import ChatService from "@/services/chat-service";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState("welcome");
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSession, setActiveSession] = useState(null);

  // Load private mode state and active session from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPrivateMode = localStorage.getItem("sefgh_private_mode");
      if (savedPrivateMode) {
        setIsPrivateMode(JSON.parse(savedPrivateMode));
      }

      // Load active session or create new one
      const activeId = ChatService.getActiveSessionId();
      if (activeId) {
        const session = ChatService.getSession(activeId);
        if (session) {
          setActiveSession(session);
        } else {
          // Active session ID exists but session not found, create new
          const newSession = ChatService.createNewSession();
          setActiveSession(newSession);
          ChatService.setActiveSessionId(newSession.id);
        }
      } else {
        // No active session, create new one
        const newSession = ChatService.createNewSession();
        setActiveSession(newSession);
        ChatService.setActiveSessionId(newSession.id);
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

  /**
   * Create a new chat session
   * Saves current session if it has messages before creating new one
   */
  const createNewChat = () => {
    if (activeSession && activeSession.messages.length > 0) {
      // Save current session before creating new one
      ChatService.saveSession(activeSession);
    }

    // Create new session
    const newSession = ChatService.createNewSession();
    setActiveSession(newSession);
    ChatService.setActiveSessionId(newSession.id);
    
    // Switch to chat view
    setCurrentView("chat");
  };

  /**
   * Load a session from history
   * @param {string} sessionId - ID of the session to load
   */
  const loadSession = (sessionId) => {
    // Save current session if it has messages
    if (activeSession && activeSession.messages.length > 0) {
      ChatService.saveSession(activeSession);
    }

    // Load the selected session
    const session = ChatService.getSession(sessionId);
    if (session) {
      setActiveSession(session);
      ChatService.setActiveSessionId(session.id);
      setCurrentView("chat");
    }
  };

  /**
   * Update the active session
   * @param {Object} updatedSession - Updated session object
   */
  const updateActiveSession = (updatedSession) => {
    setActiveSession(updatedSession);
  };

  /**
   * Save the current active session
   */
  const saveActiveSession = () => {
    if (activeSession && activeSession.messages.length > 0) {
      ChatService.saveSession(activeSession);
    }
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
    activeSession,
    setActiveSession,
    createNewChat,
    loadSession,
    updateActiveSession,
    saveActiveSession,
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
