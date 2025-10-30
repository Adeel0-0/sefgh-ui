import Image from "next/image";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppHeader({ onToggleSearch }) {
  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between flex-shrink-0">
      {/* Left side - Logo and name */}
      <div className="flex items-center gap-3">
        <Image
          src="/sefgh-logo.svg"
          alt="SEFGH Logo"
          width={40}
          height={40}
          className="rounded-md"
        />
        <h1 className="text-xl font-bold">SEFGH AI</h1>
      </div>
      
      {/* Right side - GitHub toggle button */}
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleSearch}
        aria-label="Toggle GitHub Search"
      >
        <Github className="h-5 w-5" />
      </Button>
    </header>
  );
}
