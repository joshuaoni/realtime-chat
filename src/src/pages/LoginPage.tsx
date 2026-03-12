import React, { useState, FormEvent } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, Zap, Shield } from "lucide-react";
import { cn } from "../lib/utils";

interface Props {
  onLoggedIn: () => void;
}

export function LoginPage({ onLoggedIn }: Props) {
  const { setUsername } = useAuth();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setUsername(name.trim());
      onLoggedIn();
      setIsSubmitting(false);
    }, 800);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-md animate-in relative z-10">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-violet-500 blur-2xl opacity-20 animate-pulse" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-pink-500 to-violet-600 shadow-2xl shadow-violet-500/40 rotate-12">
              <MessageSquare className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-sm font-display mb-1">Kairos</h1>
          <p className="text-slate-400 font-medium">Real-time messaging simplified.</p>
        </div>

        <div className="glass rounded-4xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/5 relative overflow-hidden">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-400">
              <Zap className="h-4 w-4" />
              <span>Get Started</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="username" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">
                Display Name
              </label>
              <div className="relative group">
                <Input
                  id="username"
                  placeholder="e.g. Alex"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={isSubmitting}
                  className="h-14 bg-slate-950/50 border-slate-800/80 focus:border-violet-500/50 focus:ring-8 focus:ring-violet-500/5 rounded-2xl text-base px-5 transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-violet-500">
                  <Shield className="h-4 w-4" />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className={cn(
                "w-full h-14 bg-linear-to-r from-pink-500 to-violet-600 hover:scale-[1.02] active:scale-[0.98] transition-all font-bold rounded-2xl text-white shadow-xl shadow-violet-500/20 relative overflow-hidden",
                isSubmitting && "opacity-80"
              )}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Connecting...</span>
                </div>
              ) : (
                "Join Chatroom"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}