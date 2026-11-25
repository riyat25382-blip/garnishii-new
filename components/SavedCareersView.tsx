"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Career } from "@/data/careers";
import CareerCard from "./CareerCard";

const KEY = "garnishii-saved-careers";

export default function SavedCareersView({ careers }: { careers: Career[] }) {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => {
      try {
        const value: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
        setIds(Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : []);
      } catch {
        setIds([]);
      }
    };
    sync();
    window.addEventListener("garnishii-storage-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("garnishii-storage-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const saved = careers.filter((career) => ids.includes(career.id));
  if (!saved.length) return <div className="empty-state"><span>♡</span><h2>Your saved space is ready</h2><p>Keep the paths you’re curious about close by. Tap the heart on any career to save it here.</p><Link className="button button--dark" href="/explore">Explore careers </Link></div>;
  return <div className="career-grid career-grid--explore">{saved.map((career) => <CareerCard key={career.id} career={career} />)}</div>;
}
