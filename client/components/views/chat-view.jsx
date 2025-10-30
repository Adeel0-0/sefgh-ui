"use client";

import ChatInterface from "@/components/core/chat/chat-interface";

export default function ChatView({ onShowRepositories }) {
  return <ChatInterface onShowRepositories={onShowRepositories} />;
}
