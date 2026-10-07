"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { STARTER_SESSIONS, STORAGE_KEY, type SavedState } from "./sessions";

// React's built-in way to read data that lives outside React (here: localStorage).
// Components "subscribe" so they re-render whenever we save something new.
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

const readRaw = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // storage blocked (e.g. private mode): fall back to starter data
  }
};

const FALLBACK: SavedState = { sessions: STARTER_SESSIONS, joinedIds: [] };

export function useStudyState() {
  // The server (and first hydration pass) sees `null`; the browser sees the real value.
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  // `ready` is false on the server and flips to true once we're in the browser.
  const ready = useSyncExternalStore(subscribe, () => true, () => false);

  const state = useMemo<SavedState>(() => {
    if (!raw) return FALLBACK;
    try {
      return JSON.parse(raw) as SavedState;
    } catch {
      return FALLBACK;
    }
  }, [raw]);

  // Same shape as React's setState: pass a function that receives the old state.
  const update = useCallback((fn: (prev: SavedState) => SavedState) => {
    const next = fn(JSON.parse(readRaw() ?? "null") ?? FALLBACK);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage full or unavailable: nothing more we can do.
    }
    listeners.forEach((l) => l());
  }, []);

  return { state, update, ready };
}
