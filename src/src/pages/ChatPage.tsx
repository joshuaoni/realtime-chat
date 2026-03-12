import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../hooks/useChat";
import { MessageList } from "../components/MessageList";
import { MessageInput } from "../components/MessageInput";
import { LogOut, MessageSquare, Hash, Menu, Share2 } from "lucide-react";
import { cn } from "../lib/utils";

export function ChatPage() {
  const { username, setUsername } = useAuth();
  const {
    messages,
    loading,
    sending,
    send,
    endRef,
    typingUser,
    handleTyping,
    activeUsers
  } = useChat(username);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!username) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-pulse rounded-full bg-slate-900 border border-slate-800" />
          <p className="text-slate-400 font-medium tracking-widest uppercase text-[10px]">Loading Nexus...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    setUsername(null);
    window.location.reload();
  };

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-pink-500 to-violet-500 text-white shadow-lg shadow-pink-500/10">
            <MessageSquare className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-white font-display tracking-tight">Kairos</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-hide">
        <div className="space-y-2">
          <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Channels
          </h3>
          <div className="space-y-1">
            <button className="flex w-full items-center gap-3 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white ring-1 ring-slate-800 shadow-sm transition-all hover:bg-slate-800/80">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                <Hash className="h-4 w-4" />
              </div>
              <span>general</span>
              <div className="ml-auto flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              </div>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Online — {activeUsers.length}
            </h3>
          </div>
          <div className="space-y-1">
            {activeUsers.map((user) => (
              <div
                key={user}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all group",
                  user === username ? "bg-white/5 border border-white/5" : "text-slate-400"
                )}
              >
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    {user[0].toUpperCase()}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-slate-950 shadow-sm" />
                </div>
                <div className="flex flex-col">
                  <span className={cn("font-medium", user === username ? "text-slate-100" : "text-slate-400")}>
                    {user} {user === username && "(You)"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-950/20 backdrop-blur-xl border-t border-slate-800/50">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-900/50 p-2 shadow-inner border border-white/5 group">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-linear-to-br from-pink-500 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg">
            {username[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{username}</p>
            <p className="text-[10px] text-slate-500 font-medium">Core Member</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all active:scale-90"
            title="Sign Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-72 flex-col border-r border-slate-800/10 bg-slate-950/20 backdrop-blur-3xl lg:flex relative overflow-hidden">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-violet-600/5 blur-[120px]" />
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 flex flex-col border-r border-slate-800/50 bg-slate-950 transition-transform duration-500 ease-in-out lg:hidden",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col min-h-0 relative">
        {/* Header */}
        <header className="glass sticky top-0 z-10 flex h-16 items-center justify-between px-6 border-transparent border-b-white/5 shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-slate-400 hover:text-white transition-all transform active:scale-95"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <Hash className="h-4 w-4 text-violet-500" />
                <h2 className="text-sm font-black text-white tracking-tight">general</h2>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1 w-1 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.5)]" />
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{activeUsers.length} active</p>
              </div>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 relative flex flex-col min-h-0">
          {/* Decorative flow blurs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] -z-10 pointer-events-none opacity-30" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/5 blur-[120px] -z-10 pointer-events-none opacity-30" />

          {loading ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="relative h-14 w-14">
                  <div className="absolute inset-0 animate-ping rounded-full bg-violet-500/20" />
                  <div className="relative flex h-full w-full items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl rotate-45">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent -rotate-45" />
                  </div>
                </div>
                <p className="text-[10px] font-black text-slate-600 tracking-[0.2em] uppercase">Connecting nexus...</p>
              </div>
            </div>
          ) : (
            <MessageList
              messages={messages}
              currentUser={username}
              endRef={endRef}
              typingUser={typingUser}
            />
          )}
        </div>

        {/* Input Container */}
        <div className="shrink-0 px-4 pb-4 pt-2 bg-linear-to-t from-slate-950 via-slate-950/95 to-transparent relative z-20">
          <MessageInput onSend={send} disabled={sending || !username} onTyping={handleTyping} />
        </div>
      </main>
    </div>
  );
}