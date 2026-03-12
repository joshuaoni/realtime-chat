import { useEffect, useRef, useState, useCallback } from "react";
import type { Message } from "../types";
import { fetchMessages, postMessage } from "../services/api";
import {
  sendSocketMessage,
  subscribeToMessages,
  sendTyping,
  sendStopTyping,
  subscribeToTyping,
  joinChat,
  subscribeToUsers
} from "../services/socket";

export function useChat(username: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);

  useEffect(() => {
    async function init() {
      try {
        const history = await fetchMessages();
        setMessages(history);
      } finally {
        setLoading(false);
      }
    }
    init();

    if (username) {
      joinChat(username);
    }

    const unsubscribeMessages = subscribeToMessages(msg => {
      setMessages(prev => [...prev, msg]);
      setTypingUser(null);
    });

    const unsubscribeTyping = subscribeToTyping(
      (user) => setTypingUser(user),
      () => setTypingUser(null)
    );

    const unsubscribeUsers = subscribeToUsers((users) => {
      setActiveUsers(users);
    });

    return () => {
      unsubscribeMessages();
      unsubscribeTyping();
      unsubscribeUsers();
    };
  }, [username]);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typingUser]);

  const handleTyping = useCallback(() => {
    if (!username) return;
    sendTyping(username);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      sendStopTyping();
    }, 3000);
  }, [username]);

  async function send(text: string) {
    if (!username) return;
    setSending(true);
    sendStopTyping();
    try {
      await postMessage(username, text);
      sendSocketMessage(username, text);
    } finally {
      setSending(false);
    }
  }

  return {
    messages,
    loading,
    sending,
    send,
    endRef,
    typingUser,
    handleTyping,
    activeUsers
  };
}