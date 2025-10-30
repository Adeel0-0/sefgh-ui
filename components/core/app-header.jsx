"use client";

import { ChevronDown, Download, Share2, Github, Ghost, User, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useAppContext } from "@/contexts/app-context";
import { cn } from "@/lib/utils";

export default function AppHeader() {
  const { theme, setTheme } = useTheme();
  const { toggleSearchPanel, isPrivateMode, togglePrivateMode } = useAppContext();

  const handleExport = (format) => {
    alert(`Export as ${format} - Not yet implemented`);
  };

  const handleShare = () => {
    alert("Share functionality - Not yet implemented");
  };

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between flex-shrink-0">
      {/* Left side - Logo/Title and Version */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">SEFGH</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              v1.0
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>v1.0 (current)</DropdownMenuItem>
            <DropdownMenuItem disabled>v0.9</DropdownMenuItem>
            <DropdownMenuItem disabled>v0.8</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center gap-2">
        {/* Export Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" title="Export">
              <Download className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Export Chat</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleExport("JSON")}>
              Export as JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("Markdown")}>
              Export as Markdown
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("PDF")}>
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Share Button */}
        <Button variant="ghost" size="icon" onClick={handleShare} title="Share">
          <Share2 className="h-5 w-5" />
        </Button>

        {/* GitHub Search Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleSearchPanel} title="Toggle GitHub Search">
          <Github className="h-5 w-5" />
        </Button>

        {/* Private Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePrivateMode}
          title="Toggle Private Mode"
          className={cn(
            isPrivateMode && "text-orange-500 hover:text-orange-600"
          )}
        >
          <Ghost className="h-5 w-5" />
        </Button>

        {/* User Profile & Settings */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" title="User Profile">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Sun className="h-4 w-4 mr-2" />
                Theme
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Monitor className="h-4 w-4 mr-2" />
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
