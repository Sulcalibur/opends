/**
 * useKeyboardShortcut Composable
 * Register global keyboard shortcuts
 */

import { onMounted, onUnmounted } from "vue";

export interface KeyboardShortcutOptions {
  /** Key to match (e.g., 'k', 'Enter', 'Escape') */
  key: string;
  /** Require Command key (Mac) */
  metaKey?: boolean;
  /** Require Control key (Windows/Linux) */
  ctrlKey?: boolean;
  /** Require Shift key */
  shiftKey?: boolean;
  /** Require Alt key */
  altKey?: boolean;
  /** Prevent default browser behavior */
  preventDefault?: boolean;
  /** Stop event propagation */
  stopPropagation?: boolean;
}

/**
 * Register a global keyboard shortcut
 * Automatically handles Mac (Cmd) vs Windows/Linux (Ctrl) for common shortcuts
 */
export function useKeyboardShortcut(
  options: KeyboardShortcutOptions,
  callback: (event: KeyboardEvent) => void,
) {
  const handler = (event: KeyboardEvent) => {
    const {
      key,
      metaKey,
      ctrlKey,
      shiftKey,
      altKey,
      preventDefault,
      stopPropagation,
    } = options;

    // Check if key matches
    if (event.key.toLowerCase() !== key.toLowerCase()) return;

    // Handle Cmd/Ctrl - if either metaKey or ctrlKey is required, accept either
    const needsModifier = metaKey || ctrlKey;
    if (needsModifier) {
      const hasModifier = event.metaKey || event.ctrlKey;
      if (!hasModifier) return;
    } else {
      if (metaKey !== undefined && event.metaKey !== metaKey) return;
      if (ctrlKey !== undefined && event.ctrlKey !== ctrlKey) return;
    }

    if (shiftKey !== undefined && event.shiftKey !== shiftKey) return;
    if (altKey !== undefined && event.altKey !== altKey) return;

    // Execute callback
    if (preventDefault) {
      event.preventDefault();
    }
    if (stopPropagation) {
      event.stopPropagation();
    }

    callback(event);
  };

  onMounted(() => {
    document.addEventListener("keydown", handler);
  });

  onUnmounted(() => {
    document.removeEventListener("keydown", handler);
  });

  // Return handler for manual control if needed
  return {
    stop: () => document.removeEventListener("keydown", handler),
  };
}

/**
 * Common keyboard shortcuts
 */
export function useSearchShortcut(callback: () => void) {
  return useKeyboardShortcut(
    { key: "k", metaKey: true, ctrlKey: true, preventDefault: true },
    callback,
  );
}

export function useEscapeShortcut(callback: () => void) {
  return useKeyboardShortcut({ key: "Escape" }, callback);
}

export type UseKeyboardShortcutReturn = ReturnType<typeof useKeyboardShortcut>;
