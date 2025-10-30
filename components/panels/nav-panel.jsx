"use client";

import {
  MessageSquarePlus,
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
  LogOut,
} from "lucide-react";
import { useAppContext } from "@/contexts/app-context";
import { cn } from "@/lib/utils";

const navigationItems = [
  { id: "chat", label: "New Chat", icon: MessageSquarePlus },
  { id: "history", label: "History", icon: History },
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "docs", label: "Docs", icon: Book },
  { id: "community", label: "Community", icon: Users },
  { id: "starred", label: "Starred Repos", icon: Star },
  { id: "pull-requests", label: "Pull Requests", icon: GitPullRequest },
  { id: "packages", label: "Packages", icon: Package },
  { id: "workbench", label: "Workbench", icon: Briefcase },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "docs-library", label: "Docs Library", icon: Library },
  { id: "help", label: "Help", icon: HelpCircle },
];

export default function NavPanel() {
  const { currentView, setCurrentView, isMobileMenuOpen, setIsMobileMenuOpen, createNewChat } = useAppContext();

  const handleNavigation = (viewId) => {
    // Special handling for "New Chat" - use createNewChat which saves current session
    if (viewId === "chat") {
      createNewChat();
    } else {
      setCurrentView(viewId);
    }
    
    // Close mobile menu on navigation if it's open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    // For now, just show an alert. Can be replaced with actual logout logic
    if (typeof window !== "undefined") {
      alert("Logout functionality not yet implemented");
    }
  };

  return (
    <nav className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold">Navigation</h2>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                currentView === item.id && "bg-accent text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Logout button at bottom */}
      <div className="border-t border-border p-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
