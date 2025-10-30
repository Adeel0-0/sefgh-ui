"use client";

import { useState } from "react";
import AppHeader from "@/components/core/app-header";
import ChatInterface from "@/components/core/chat/chat-interface";
import GitHubSearchPanel from "@/components/panels/github-search-panel";

export default function Home() {
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);

  const handleToggleSearch = () => {
    setIsSearchPanelOpen(!isSearchPanelOpen);
  };

  const handleShowRepositories = () => {
    setIsSearchPanelOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchPanelOpen(false);
  };

  return (
    <>
      <AppHeader onToggleSearch={handleToggleSearch} />
      <ChatInterface onShowRepositories={handleShowRepositories} />
      <GitHubSearchPanel 
        isOpen={isSearchPanelOpen} 
        onClose={handleCloseSearch} 
      />
    </>
  );
}
