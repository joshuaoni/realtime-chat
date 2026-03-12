import { fetchMessages, postMessage } from "../services/api";
import {
    getSocket,
    joinChat,
    sendSocketMessage,
    subscribeToMessages,
    subscribeToUsers,
    sendTyping,
    sendStopTyping,
    subscribeToTyping
} from "../services/socket";
import { io } from "socket.io-client";

// Mock global fetch
(globalThis as any).fetch = jest.fn();

// Mock socket.io-client
jest.mock("socket.io-client", () => {
    const mSocket = {
        emit: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
    };
    return { io: jest.fn(() => mSocket) };
});

describe("API Service", () => {
    beforeEach(() => {
        (fetch as jest.Mock).mockClear();
    });

    test("fetchMessages success", async () => {
        const mockMsgs = [{ id: "1", text: "hi" }];
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockMsgs,
        });

        const msgs = await fetchMessages();
        expect(msgs).toEqual(mockMsgs);
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/messages"));
    });

    test("fetchMessages failure", async () => {
        (fetch as jest.Mock).mockResolvedValue({ ok: false });
        await expect(fetchMessages()).rejects.toThrow("Failed to load messages");
    });

    test("postMessage success", async () => {
        const mockMsg = { id: "2", text: "hello" };
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockMsg,
        });

        const msg = await postMessage("user", "hello");
        expect(msg).toEqual(mockMsg);
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("/messages"),
            expect.objectContaining({ method: "POST" })
        );
    });

    test("postMessage failure", async () => {
        (fetch as jest.Mock).mockResolvedValue({ ok: false });
        await expect(postMessage("u", "t")).rejects.toThrow("Failed to send message");
    });
});

describe("Socket Service", () => {
    let socket: any;

    beforeEach(() => {
        jest.clearAllMocks();
        socket = getSocket();
    });

    test("getSocket initializes socket", () => {
        expect(io).toHaveBeenCalled();
        expect(socket).toBeDefined();
    });

    test("joinChat emits join", () => {
        joinChat("alex");
        expect(socket.emit).toHaveBeenCalledWith("join", "alex");
    });

    test("sendSocketMessage emits sendMessage", () => {
        sendSocketMessage("alex", "hi");
        expect(socket.emit).toHaveBeenCalledWith("sendMessage", { sender: "alex", text: "hi" });
    });

    test("subscribeToMessages registers and unregisters callback", () => {
        const cb = jest.fn();
        const unsubscribe = subscribeToMessages(cb);
        expect(socket.on).toHaveBeenCalledWith("message", cb);
        unsubscribe();
        expect(socket.off).toHaveBeenCalledWith("message", cb);
    });

    test("subscribeToUsers registers and unregisters callback", () => {
        const cb = jest.fn();
        const unsubscribe = subscribeToUsers(cb);
        expect(socket.on).toHaveBeenCalledWith("usersUpdate", cb);
        unsubscribe();
        expect(socket.off).toHaveBeenCalledWith("usersUpdate", cb);
    });

    test("sendTyping emits typing", () => {
        sendTyping("alex");
        expect(socket.emit).toHaveBeenCalledWith("typing", "alex");
    });

    test("sendStopTyping emits stopTyping", () => {
        sendStopTyping();
        expect(socket.emit).toHaveBeenCalledWith("stopTyping");
    });

    test("subscribeToTyping registers and unregisters callbacks", () => {
        const onT = jest.fn();
        const onS = jest.fn();
        const unsubscribe = subscribeToTyping(onT, onS);
        expect(socket.on).toHaveBeenCalledWith("userTyping", onT);
        expect(socket.on).toHaveBeenCalledWith("userStoppedTyping", onS);
        unsubscribe();
        expect(socket.off).toHaveBeenCalledWith("userTyping", onT);
        expect(socket.off).toHaveBeenCalledWith("userStoppedTyping", onS);
    });
});
