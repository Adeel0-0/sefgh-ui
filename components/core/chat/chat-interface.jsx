"use client";

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatService from "@/services/chat-service";

export default function ChatInterface({ onShowRepositories }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  // Load chat session on mount
  useEffect(() => {
    const loadedMessages = ChatService.loadChatSession();
    setMessages(loadedMessages);
  }, []);

  // Save chat session whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      ChatService.saveChatSession(messages);
    }
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isThinking) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    // Add user message
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    
    // Show thinking indicator
    setIsThinking(true);
    setMessages(prev => [...prev, { role: "assistant", content: "Thinking..." }]);

    // Simulate AI response delay
    setTimeout(() => {
      setMessages(prev => {
        // Remove thinking message
        const withoutThinking = prev.slice(0, -1);
        
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

        return [...withoutThinking, { 
          role: "assistant", 
          content: responseContent,
          showSearchButton: isSearchQuery 
        }];
      });
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
