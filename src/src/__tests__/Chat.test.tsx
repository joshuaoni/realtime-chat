import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { App } from "../App";
import { AuthProvider } from "../context/AuthContext";

// Mock socket module
jest.mock("../services/socket", () => {
  const listeners: Record<string, ((...args: any[]) => void)[]> = {};
  return {
    getSocket: jest.fn(),
    sendSocketMessage: jest.fn(),
    subscribeToMessages: (cb: (msg: any) => void) => {
      listeners["message"] = [cb];
      return () => { delete listeners["message"]; };
    },
    __emitMessage: (msg: any) => {
      (listeners["message"] || []).forEach(fn => fn(msg));
    },
    sendTyping: jest.fn(),
    sendStopTyping: jest.fn(),
    subscribeToTyping: (onTyping: (u: string) => void, onStop: () => void) => {
      listeners["typing"] = [onTyping];
      listeners["stopTyping"] = [onStop];
      return () => {
        delete listeners["typing"];
        delete listeners["stopTyping"];
      };
    },
    __emitTyping: (user: string) => {
      (listeners["typing"] || []).forEach(fn => fn(user));
    },
    __emitStopTyping: () => {
      (listeners["stopTyping"] || []).forEach(fn => fn());
    },
    joinChat: jest.fn(),
    subscribeToUsers: (cb: (users: string[]) => void) => {
      listeners["users"] = [cb];
      return () => {
        delete listeners["users"];
      };
    },
    __emitUsers: (users: string[]) => {
      (listeners["users"] || []).forEach(fn => fn(users));
    }
  };
});

// Mock API
jest.mock("../services/api", () => ({
  fetchMessages: jest.fn().mockResolvedValue([
    {
      id: "1",
      sender: "User A",
      text: "Hello",
      createdAt: new Date().toISOString()
    }
  ]),
  postMessage: jest
    .fn()
    .mockResolvedValue({
      id: "2",
      sender: "User A",
      text: "New message",
      createdAt: new Date().toISOString()
    })
}));

import * as socketModule from "../services/socket";

function renderWithAuth() {
  return render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

async function login(username: string) {
  const input = screen.getByPlaceholderText(/alex/i);
  fireEvent.change(input, { target: { value: username } });
  fireEvent.click(screen.getByText("Join Chatroom"));
  await act(async () => {
    jest.advanceTimersByTime(800);
  });
}

test("renders initial message", async () => {
  renderWithAuth();
  await login("User A");

  await waitFor(() => {
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});

test("send button triggers send", async () => {
  renderWithAuth();
  await login("User A");

  await waitFor(() => {
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  const messageInput = screen.getByLabelText("Message input");
  fireEvent.change(messageInput, { target: { value: "New message" } });
  fireEvent.click(screen.getByLabelText("Send message"));

  await waitFor(() => {
    expect(socketModule.sendSocketMessage).toHaveBeenCalled();
  });
});

test("mock socket event updates UI", async () => {
  renderWithAuth();
  await login("User B");

  await waitFor(() => {
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  const msg = {
    id: "3",
    sender: "User B",
    text: "From socket",
    createdAt: new Date().toISOString()
  };

  act(() => {
    (socketModule as any).__emitMessage(msg);
  });

  await waitFor(() => {
    expect(screen.getByText("From socket")).toBeInTheDocument();
  });
});

test("typing indicator works", async () => {
  renderWithAuth();
  await login("User A");

  await waitFor(() => {
    expect(screen.getAllByText(/general/i).length).toBeGreaterThan(0);
  });

  act(() => {
    (socketModule as any).__emitTyping("User B");
  });

  await waitFor(() => {
    expect(screen.getByText(/User B is typing/i)).toBeInTheDocument();
  });

  act(() => {
    (socketModule as any).__emitStopTyping();
  });

  await waitFor(() => {
    expect(screen.queryByText(/User B is typing/i)).not.toBeInTheDocument();
  });
});

test("typing event is sent on input", async () => {
  renderWithAuth();
  await login("User A");

  await waitFor(() => {
    expect(screen.getByLabelText("Message input")).toBeInTheDocument();
  });

  const messageInput = screen.getByLabelText("Message input");
  fireEvent.change(messageInput, { target: { value: "T" } });

  expect(socketModule.sendTyping).toHaveBeenCalledWith("User A");

  await act(async () => {
    jest.advanceTimersByTime(3000);
  });

  expect(socketModule.sendStopTyping).toHaveBeenCalled();
});

test("logout works", async () => {
  renderWithAuth();
  await login("User A");

  let signOutBtns: HTMLElement[] = [];
  await waitFor(() => {
    signOutBtns = screen.getAllByTitle("Sign Out");
    expect(signOutBtns.length).toBeGreaterThan(0);
  });

  fireEvent.click(signOutBtns[0]);

  await waitFor(() => {
    expect(screen.getByText("Join Chatroom")).toBeInTheDocument();
  });
});

test("sidebar mobile toggle and user list updates", async () => {
  renderWithAuth();
  await login("User A");

  await waitFor(() => {
    expect(screen.getByLabelText(/Message input/i)).toBeInTheDocument();
  });

  // Open mobile sidebar
  const openBtn = screen.getByLabelText("Open sidebar");
  fireEvent.click(openBtn);

  // Close via overlay
  const overlay = screen.getByLabelText("Close sidebar");
  fireEvent.click(overlay);

  // Emit users
  act(() => {
    (socketModule as any).__emitUsers(["User A", "User B"]);
  });

  await waitFor(() => {
    expect(screen.getAllByText(/User B/i).length).toBeGreaterThan(0);
  });
});

test("system messages work", async () => {
  renderWithAuth();
  await login("User A");

  await waitFor(() => {
    expect(screen.getByLabelText(/Message input/i)).toBeInTheDocument();
  });

  act(() => {
    (socketModule as any).__emitMessage({
      id: "sys-1",
      sender: "System",
      text: "User X joined",
      createdAt: new Date().toISOString(),
      isSystem: true
    });
  });

  await waitFor(() => {
    expect(screen.getByText("User X joined")).toBeInTheDocument();
  });
});
