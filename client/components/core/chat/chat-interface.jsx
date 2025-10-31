"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatService from "@/services/chat-service";
import { useAppContext } from "@/contexts/app-context";

export default function ChatInterface({ onShowRepositories }) {
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const { activeSession, updateActiveSession } = useAppContext();

  const messages = useMemo(() => activeSession?.messages || [], [activeSession?.messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isThinking || !activeSession) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    // Check if this is the first message - if so, generate title
    const isFirstMessage = activeSession.messages.length === 0;
    
    // Add user message
    const updatedMessages = [...activeSession.messages, { role: "user", content: userMessage }];
    
    // Update session with new message and title if needed
    const updatedSession = {
      ...activeSession,
      messages: updatedMessages,
      title: isFirstMessage ? ChatService.generateTitle(userMessage) : activeSession.title
    };
    
    updateActiveSession(updatedSession);
    
    // Show thinking indicator
    setIsThinking(true);
    const withThinking = [...updatedMessages, { role: "assistant", content: "Thinking..." }];
    updateActiveSession({ ...updatedSession, messages: withThinking });

    // Simulate AI response delay
    setTimeout(() => {
      // Remove thinking message
      const withoutThinking = updatedMessages;
      
      // Check if user asked about search/find
      const searchKeywords = ["search", "find", "look for", "show me", "repositories", "repos", "projects"];
      const isSearchQuery = searchKeywords.some(keyword => 
        userMessage.toLowerCase().includes(keyword)
      );

      let responseContent;
      if (isSearchQuery) {
        responseContent = "I can help you find GitHub repositories! Click the button below to open the search panel and explore relevant projects.";
      } else {
        responseContent = "I understand you're looking for information. If you'd like to search for GitHub repositories, just ask me to 'search' or 'find' something specific!";
      }

      const finalMessages = [...withoutThinking, { 
        role: "assistant", 
        content: responseContent,
        showSearchButton: isSearchQuery 
      }];
      
      const finalSession = { ...updatedSession, messages: finalMessages };
      updateActiveSession(finalSession);
      
      // Save session to localStorage after receiving response
      ChatService.saveSession(finalSession);
      
      setIsThinking(false);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              
              {/* Show search button if applicable */}
              {message.showSearchButton && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                  onClick={onShowRepositories}
                >
                  Show Relevant Repositories
                </Button>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <div className="border-t border-border p-4 bg-card">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me to search for repositories..."
            disabled={isThinking}
            className="flex-1"
          />
          <Button type="submit" disabled={isThinking || !inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
