import React, { useState, FormEvent, useRef } from "react";
import { SendHorizontal, Smile } from "lucide-react";
import { cn } from "../lib/utils";

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
  onTyping?: () => void;
}

const EMOJIS = ["😀", "😂", "🥰", "😎", "🤔", "🔥", "🚀", "✨", "🎉", "👍"];

export function MessageInput({ onSend, disabled, onTyping }: Props) {
  const [value, setValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    if (onTyping) onTyping();
  }

  function addEmoji(emoji: string) {
    setValue(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto w-full relative group"
    >
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full mb-4 left-0 glass p-3 rounded-2xl shadow-2xl animate-scale z-50 min-w-[200px]">
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-2 px-1 tracking-wider">Quick Reactions</p>
          <div className="grid grid-cols-5 gap-2">
            {EMOJIS.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => addEmoji(emoji)}
                className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-slate-800 transition-all text-xl active:scale-90"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={cn(
        "flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl transition-all focus-within:border-violet-500/50 focus-within:ring-4 focus-within:ring-violet-500/10 shadow-2xl",
        disabled && "opacity-50 grayscale pointer-events-none"
      )}>
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={cn(
            "p-2 ml-1 transition-all rounded-lg active:scale-95",
            showEmojiPicker ? "text-violet-400 bg-violet-500/10" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
          )}
          title="Emoji Picker"
        >
          <Smile className="h-5 w-5" />
        </button>

        <input
          ref={inputRef}
          placeholder="Type your message..."
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="flex-1 bg-transparent py-2.5 px-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none"
          aria-label="Message input"
        />

        <div className="flex items-center gap-1.5 pr-1">
          <button
            type="submit"
            disabled={!value.trim() || disabled}
            aria-label="Send message"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl transition-all",
              value.trim()
                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/25 hover:bg-violet-500 scale-100"
                : "bg-slate-800 text-slate-500 scale-95 opacity-50 cursor-not-allowed"
            )}
          >
            <SendHorizontal className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </form>
  );
}