"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/contexts/app-context";

export default function WelcomeView() {
  const { currentView, isSearchPanelOpen } = useAppContext();

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome to SEFGH</CardTitle>
          <CardDescription>
            A powerful GitHub search engine with AI capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              <span className="font-semibold">Current view:</span> {currentView}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">GitHub Search Panel:</span>{" "}
              {isSearchPanelOpen ? "Open" : "Closed"}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Use the navigation panel on the left to explore different features:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Start a new chat conversation</li>
              <li>View your chat history</li>
              <li>Explore trending repositories</li>
              <li>Access documentation and community resources</li>
              <li>Manage your workbench and settings</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
