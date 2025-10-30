"use client";

import { useState, useEffect } from "react";
import { Search, Pencil, Trash2, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatService from "@/services/chat-service";
import { useAppContext } from "@/contexts/app-context";
import { cn } from "@/lib/utils";

/**
 * Group sessions by time periods
 */
const groupSessionsByTime = (sessions) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const groups = {
    today: [],
    yesterday: [],
    previous7Days: [],
    previous30Days: [],
    older: []
  };

  sessions.forEach(session => {
    const sessionDate = new Date(session.createdAt);
    
    if (sessionDate >= today) {
      groups.today.push(session);
    } else if (sessionDate >= yesterday) {
      groups.yesterday.push(session);
    } else if (sessionDate >= sevenDaysAgo) {
      groups.previous7Days.push(session);
    } else if (sessionDate >= thirtyDaysAgo) {
      groups.previous30Days.push(session);
    } else {
      groups.older.push(session);
    }
  });

  return groups;
};

export default function HistoryPanel() {
  const [sessions, setSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredSessionId, setHoveredSessionId] = useState(null);
  const { loadSession, activeSession } = useAppContext();

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const allSessions = ChatService.getSessions();
    // Sort by createdAt descending (newest first)
    const sorted = allSessions.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    setSessions(sorted);
  };

  // Filter sessions based on search query
  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered sessions by time
  const groupedSessions = groupSessionsByTime(filteredSessions);

  const handleSessionClick = (sessionId) => {
    loadSession(sessionId);
  };

  const handleRename = (e, sessionId, currentTitle) => {
    e.stopPropagation();
    const newTitle = prompt("Enter new title:", currentTitle);
    if (newTitle && newTitle.trim()) {
      ChatService.updateSessionTitle(sessionId, newTitle.trim());
      loadSessions();
    }
  };

  const handleDelete = (e, sessionId) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this chat?")) {
      ChatService.deleteSession(sessionId);
      loadSessions();
    }
  };

  const renderSessionGroup = (groupTitle, sessions) => {
    if (sessions.length === 0) return null;

    return (
      <div key={groupTitle} className="mb-4">
        <h3 className="text-xs font-semibold text-muted-foreground px-4 mb-2 uppercase">
          {groupTitle}
        </h3>
        <div className="space-y-1">
          {sessions.map(session => (
            <div
              key={session.id}
              className={cn(
                "group relative px-4 py-2 cursor-pointer transition-colors hover:bg-accent",
                activeSession?.id === session.id && "bg-accent/50"
              )}
              onClick={() => handleSessionClick(session.id)}
              onMouseEnter={() => setHoveredSessionId(session.id)}
              onMouseLeave={() => setHoveredSessionId(null)}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <MessageSquare className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span className="text-sm truncate">{session.title}</span>
                </div>
                
                {hoveredSessionId === session.id && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => handleRename(e, session.id, session.title)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={(e) => handleDelete(e, session.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold mb-3">Chat History</h2>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto py-4">
        {filteredSessions.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            {searchQuery ? "No chats found" : "No chat history yet"}
          </div>
        ) : (
          <>
            {renderSessionGroup("Today", groupedSessions.today)}
            {renderSessionGroup("Yesterday", groupedSessions.yesterday)}
            {renderSessionGroup("Previous 7 Days", groupedSessions.previous7Days)}
            {renderSessionGroup("Previous 30 Days", groupedSessions.previous30Days)}
            {renderSessionGroup("Older", groupedSessions.older)}
          </>
        )}
      </div>
    </div>
  );
}
