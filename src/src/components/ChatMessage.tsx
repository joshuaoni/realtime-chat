import React from "react";
import type { Message } from "../types";
import { cn } from "../lib/utils";

interface Props {
  message: Message;
  currentUser: string | null;
  previousMessage?: Message;
}

export function ChatMessage({ message, currentUser, previousMessage }: Props) {
  const isOwn = currentUser === message.sender;
  const isSystem = message.isSystem || message.sender === "System";
  const showMetadata = !previousMessage || previousMessage.sender !== message.sender;

  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  if (isSystem) {
    return (
      <div className="flex w-full justify-center px-1 my-2">
        <div className="rounded-full bg-slate-900/50 border border-slate-800 px-4 py-1.5 text-[11px] font-medium text-slate-500 shadow-sm animate-in">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex w-full animate-scale group px-1",
      isOwn ? "justify-end" : "justify-start",
      !showMetadata && "-mt-5"
    )}>
      <div className={cn(
        "flex max-w-[80%] flex-col gap-1",
        isOwn ? "items-end" : "items-start"
      )}>
        {showMetadata && !isOwn && (
          <span className="ml-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {message.sender}
          </span>
        )}

        <div
          className={cn(
            "relative rounded-2xl px-4 py-2.5 text-sm shadow-xl transition-all hover:scale-[1.01]",
            isOwn
              ? "bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-violet-500/10"
              : "bg-slate-900 text-slate-200 border border-slate-800",
            isOwn && showMetadata && "rounded-tr-none",
            !isOwn && showMetadata && "rounded-tl-none"
          )}
        >
          <p className="leading-relaxed wrap-break-word">{message.text}</p>
          <div className={cn(
            "mt-1.5 flex items-center gap-1.5 text-[9px] font-medium opacity-50",
            isOwn ? "justify-end text-white/70" : "justify-start text-slate-500"
          )}>
            <span>{time}</span>
            {isOwn && (
              <div className="flex -space-x-1">
                <div className="h-1.5 w-1.5 rounded-full border border-current" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}