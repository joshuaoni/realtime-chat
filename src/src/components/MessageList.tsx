import React from "react";
import type { Message } from "../types";
import { ChatMessage } from "./ChatMessage";
import { ScrollArea } from "./ui/scroll-area";

interface Props {
  messages: Message[];
  currentUser: string | null;
  endRef: React.RefObject<HTMLDivElement>;
  typingUser: string | null;
}

export function MessageList({ messages, currentUser, endRef, typingUser }: Props) {
  return (
    <ScrollArea className="flex-1 px-4 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6 py-6 font-sans">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="h-20 w-20 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
              <span className="text-4xl text-slate-700">💬</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-slate-300 font-medium font-display">No messages yet</h3>
              <p className="text-xs text-slate-500 max-w-[200px]">Be the first to say hello and start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              currentUser={currentUser}
              previousMessage={index > 0 ? messages[index - 1] : undefined}
            />
          ))
        )}

        {typingUser && (
          <div className="flex items-center gap-2 pl-2 animate-in">
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-500" style={{ animationDelay: '0ms' }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-500" style={{ animationDelay: '150ms' }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-500" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-[10px] font-medium text-slate-500">{typingUser} is typing...</span>
          </div>
        )}

        <div ref={endRef} className="h-4" />
      </div>
    </ScrollArea>
  );
}