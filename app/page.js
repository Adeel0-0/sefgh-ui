"use client";

import { Menu, X } from "lucide-react";
import {
  History,
  TrendingUp,
  Book,
  Users,
  Star,
  GitPullRequest,
  Package,
  Briefcase,
  Settings,
  Library,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/app-context";
import AppHeader from "@/components/core/app-header";
import NavPanel from "@/components/panels/nav-panel";
import GitHubSearchPanel from "@/components/panels/github-search-panel";
import HistoryPanel from "@/components/panels/history-panel";
import WelcomeView from "@/components/views/welcome-view";
import ChatView from "@/components/views/chat-view";
import PlaceholderView from "@/components/views/placeholder-view";

export default function Home() {
  const { 
    currentView, 
    isSearchPanelOpen, 
    setIsSearchPanelOpen,
    isMobileMenuOpen,
    toggleMobileMenu 
  } = useAppContext();

  const handleShowRepositories = () => {
    setIsSearchPanelOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchPanelOpen(false);
  };

  // Render the appropriate view based on currentView state
  const renderView = () => {
    switch (currentView) {
      case "welcome":
        return <WelcomeView />;
      case "chat":
        return <ChatView onShowRepositories={handleShowRepositories} />;
      case "history":
        return <HistoryPanel />;
      case "trending":
        return <PlaceholderView title="Trending" description="Explore trending repositories" icon={TrendingUp} />;
      case "docs":
        return <PlaceholderView title="Documentation" description="Browse documentation" icon={Book} />;
      case "community":
        return <PlaceholderView title="Community" description="Connect with the community" icon={Users} />;
      case "starred":
        return <PlaceholderView title="Starred Repos" description="View your starred repositories" icon={Star} />;
      case "pull-requests":
        return <PlaceholderView title="Pull Requests" description="Manage pull requests" icon={GitPullRequest} />;
      case "packages":
        return <PlaceholderView title="Packages" description="Browse packages" icon={Package} />;
      case "workbench":
        return <PlaceholderView title="Workbench" description="Your development workspace" icon={Briefcase} />;
      case "settings":
        return <PlaceholderView title="Settings" description="Configure your preferences" icon={Settings} />;
      case "docs-library":
        return <PlaceholderView title="Docs Library" description="Access documentation library" icon={Library} />;
      case "help":
        return <PlaceholderView title="Help" description="Get help and support" icon={HelpCircle} />;
      default:
        return <WelcomeView />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Mobile Menu Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 md:hidden"
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Navigation Panel - Desktop */}
      <aside className="hidden md:block w-[280px] flex-shrink-0">
        <NavPanel />
      </aside>

      {/* Navigation Panel - Mobile (Overlay) */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleMobileMenu}
          />
          {/* Panel */}
          <aside className="fixed left-0 top-0 h-full w-[280px] z-50 md:hidden">
            <NavPanel />
          </aside>
        </>
      )}

      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <AppHeader />
        {renderView()}
      </main>

      {/* GitHub Search Panel */}
      <GitHubSearchPanel 
        isOpen={isSearchPanelOpen} 
        onClose={handleCloseSearch} 
      />
    </div>
  );
}
