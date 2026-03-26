/**
 * useKeyboardShortcut Composable Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock KeyboardEvent for Node environment
class MockKeyboardEvent {
  type: string;
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  preventDefault: () => void;
  stopPropagation: () => void;
  defaultPrevented: boolean = false;

  constructor(type: string, options: KeyboardEventInit = {}) {
    this.type = type;
    this.key = options.key || "";
    this.metaKey = options.metaKey || false;
    this.ctrlKey = options.ctrlKey || false;
    this.shiftKey = options.shiftKey || false;
    this.altKey = options.altKey || false;
    this.preventDefault = vi.fn();
    this.stopPropagation = vi.fn();
  }
}

// Add to global
Object.defineProperty(globalThis, "KeyboardEvent", {
  value: MockKeyboardEvent,
  writable: true,
});

// Mock document event listeners
const eventListeners: Map<string, Set<Function>> = new Map();

const mockDocument = {
  addEventListener: (event: string, handler: Function) => {
    if (!eventListeners.has(event)) {
      eventListeners.set(event, new Set());
    }
    eventListeners.get(event)!.add(handler);
  },
  removeEventListener: (event: string, handler: Function) => {
    eventListeners.get(event)?.delete(handler);
  },
  dispatchEvent: (event: Event) => {
    const listeners = eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach((handler) => handler(event));
    }
    return true;
  },
};

Object.defineProperty(globalThis, "document", {
  value: mockDocument,
  writable: true,
});

// Mock Vue lifecycle hooks - execute callback immediately for synchronous testing
const mockOnMounted = vi.fn((fn: () => void) => fn());
const mockOnUnmounted = vi.fn();

vi.mock("vue", () => ({
  onMounted: mockOnMounted,
  onUnmounted: mockOnUnmounted,
}));

describe("useKeyboardShortcut", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    eventListeners.clear();
    mockOnMounted.mockClear();
    mockOnUnmounted.mockClear();
  });

  afterEach(() => {
    eventListeners.clear();
  });

  it("should call callback on matching key", async () => {
    const callback = vi.fn();
    const { useKeyboardShortcut } = await import("./useKeyboardShortcut");

    useKeyboardShortcut({ key: "k", metaKey: true }, callback);

    // Simulate Cmd+K
    const event = new KeyboardEvent("keydown", { key: "k", metaKey: true });
    document.dispatchEvent(event);

    expect(callback).toHaveBeenCalled();
  });

  it("should not call callback on non-matching key", async () => {
    const callback = vi.fn();
    const { useKeyboardShortcut } = await import("./useKeyboardShortcut");

    useKeyboardShortcut({ key: "k", metaKey: true }, callback);

    // Simulate just 'k' without Cmd
    const event = new KeyboardEvent("keydown", { key: "k" });
    document.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });

  it("should support Ctrl key for Windows/Linux", async () => {
    const callback = vi.fn();
    const { useKeyboardShortcut } = await import("./useKeyboardShortcut");

    useKeyboardShortcut({ key: "k", metaKey: true, ctrlKey: true }, callback);

    // Simulate Ctrl+K
    const event = new KeyboardEvent("keydown", { key: "k", ctrlKey: true });
    document.dispatchEvent(event);

    expect(callback).toHaveBeenCalled();
  });

  it("should prevent default when specified", async () => {
    const callback = vi.fn();
    const { useKeyboardShortcut } = await import("./useKeyboardShortcut");

    useKeyboardShortcut(
      { key: "k", metaKey: true, preventDefault: true },
      callback,
    );

    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
    });

    document.dispatchEvent(event);

    expect(callback).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });
});
