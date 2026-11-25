"use client";

import { useEffect, useState } from "react";

const SAVED_KEY = "garnishii-saved-careers";
const COMPARE_KEY = "garnishii-compare-careers";
const CHANGE_EVENT = "garnishii-storage-change";

function readList(key: string): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function notifyStorageChange() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function SaveButton({ careerId, compact = false }: { careerId: string; compact?: boolean }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(readList(SAVED_KEY).includes(careerId));
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [careerId]);

  function toggle() {
    const current = readList(SAVED_KEY);
    const next = saved ? current.filter((id) => id !== careerId) : [...current, careerId];
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    setSaved(!saved);
    notifyStorageChange();
  }

  return (
    <button className={`icon-button ${compact ? "icon-button--compact" : ""} ${saved ? "is-saved" : ""}`} onClick={toggle} aria-label={saved ? "Remove saved career" : "Save career"} title={saved ? "Remove saved career" : "Save career"}>
      {saved ? "♥" : "♡"}
    </button>
  );
}

export function CompareButton({ careerId }: { careerId: string }) {
  const [selected, setSelected] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const sync = () => setSelected(readList(COMPARE_KEY).includes(careerId));
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    return () => window.removeEventListener(CHANGE_EVENT, sync);
  }, [careerId]);

  function toggle() {
    const current = readList(COMPARE_KEY);
    if (!selected && current.length >= 3) {
      setMessage("Compare up to 3 careers.");
      window.setTimeout(() => setMessage(""), 2200);
      return;
    }
    const next = selected ? current.filter((id) => id !== careerId) : [...current, careerId];
    localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
    setSelected(!selected);
    setMessage("");
    notifyStorageChange();
  }

  return (
    <span className="compare-control">
      <button className={`text-button ${selected ? "text-button--active" : ""}`} onClick={toggle}>{selected ? "✓ Added" : "+ Compare"}</button>
      {message && <span className="tiny-note" role="status">{message}</span>}
    </span>
  );
}
