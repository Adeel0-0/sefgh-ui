"use client";

import { useState } from "react";
import { Github, TrendingUp, Search, MessageSquare, Code, Sparkles, Plus, Mic } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/app-context";

// Trending prompts data for the scrolling cards
const trendingPrompts = [
  {
    icon: Search,
    title: "Deployment guides",
    description: "Deploy applications to the cloud",
    prompt: "Show me deployment guides for cloud applications"
  },
  {
    icon: MessageSquare,
    title: "Code reviews",
    description: "Best practices for code reviews",
    prompt: "What are the best practices for code reviews?"
  },
  {
    icon: Code,
    title: "API integration",
    description: "Connect external APIs",
    prompt: "How do I integrate external APIs in my project?"
  },
  {
    icon: Sparkles,
    title: "Performance tips",
    description: "Optimize application speed",
    prompt: "Give me tips to optimize my application performance"
  },
  {
    icon: Search,
    title: "Security patterns",
    description: "Implement secure coding",
    prompt: "What are common security patterns I should implement?"
  },
  {
    icon: MessageSquare,
    title: "Testing strategies",
    description: "Effective testing approaches",
    prompt: "What are effective testing strategies for my codebase?"
  },
];

export default function WelcomeView() {
  const { setCurrentView, updateActiveSession, activeSession } = useAppContext();
  const [inputValue, setInputValue] = useState("");

  const handleCardClick = (prompt) => {
    setInputValue(prompt);
    handleSubmit(null, prompt);
  };

  const handleSubmit = (e, promptText = null) => {
    if (e) e.preventDefault();
    
    const message = promptText || inputValue.trim();
    if (!message) return;

    // Create first message and switch to chat view
    if (activeSession) {
      const updatedSession = {
        ...activeSession,
        messages: [{ role: "user", content: message }],
      };
      updateActiveSession(updatedSession);
    }
    
    setCurrentView("chat");
    setInputValue("");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header Section with Logo and Greeting */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {/* Custom Logo - Circular with Gradient */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center shadow-lg">
                <Github className="w-8 h-8 text-white" />
              </div>
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 blur-xl opacity-30 -z-10" />
            </div>
            
            {/* Greeting */}
            <h1 className="text-3xl md:text-4xl font-bold">Hello, User</h1>
          </div>

          {/* Trending Section */}
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Trending</h2>
            </div>

            {/* River Flow Auto-Scroller */}
            <div className="relative overflow-hidden rounded-lg">
              <div className="river-container group">
                <div className="river-flow">
                  {/* First set of cards */}
                  {trendingPrompts.map((item, index) => (
                    <Card
                      key={`card-1-${index}`}
                      className="river-card cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleCardClick(item.prompt)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <item.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {trendingPrompts.map((item, index) => (
                    <Card
                      key={`card-2-${index}`}
                      className="river-card cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleCardClick(item.prompt)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <item.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Redesigned Chat Input Bar - Floating at bottom */}
      <div className="px-6 pb-6">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 bg-card rounded-2xl shadow-lg border border-border p-3">
              {/* Attachment Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="flex-shrink-0"
                title="Add attachment"
              >
                <Plus className="w-5 h-5" />
              </Button>

              {/* Input Field */}
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask anything"
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
              />

              {/* Microphone Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="flex-shrink-0"
                title="Voice input"
              >
                <Mic className="w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .river-container {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .river-flow {
          display: flex;
          gap: 1rem;
          animation: scroll-left 35s linear infinite;
        }

        .river-container:hover .river-flow {
          animation-play-state: paused;
        }

        .river-card {
          flex: 0 0 280px;
          min-width: 280px;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 768px) {
          .river-card {
            flex: 0 0 240px;
            min-width: 240px;
          }
        }
      `}</style>
    </div>
  );
}
