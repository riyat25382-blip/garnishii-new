"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Career } from "@/data/careers";

const KEY = "garnishii-compare-careers";

export default function CompareCareersView({ careers }: { careers: Career[] }) {
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

  const selected = careers.filter((career) => ids.includes(career.id)).slice(0, 3);
  function remove(id: string) {
    const next = ids.filter((item) => item !== id);
    localStorage.setItem(KEY, JSON.stringify(next));
    setIds(next);
    window.dispatchEvent(new Event("garnishii-storage-change"));
  }

  if (!selected.length) return <div className="empty-state"><span>⇄</span><h2>Compare the paths on your mind</h2><p>Add up to three professions to explore their focus, skills and learning prompts side by side.</p><Link className="button button--dark" href="/explore">Find professions to compare</Link></div>;
  return (
    <div className="comparison-wrap">
      <div className="comparison-table">
        <div className="comparison-row comparison-row--head"><div className="comparison-label">Profession</div>{selected.map((career) => <div className="comparison-cell" key={career.id}><span className={`career-icon tone-${career.tone}`}>{career.icon}</span><Link href={`/careers/${career.slug}`}><strong>{career.title}</strong></Link><small>{career.industry} · {career.field}</small><button className="reset-button" onClick={() => remove(career.id)}>Remove</button></div>)}</div>
        {[
          ["Overview", (career: Career) => career.description],
          ["Specialisation", (career: Career) => career.specialization],
          ["Suggested skills", (career: Career) => career.skills.join(", ")],
          ["Education and entry requirements", (career: Career) => career.education],
          ["Salary", (career: Career) => career.salary.length ? career.salary.map((item) => item.range).join(", ") : "No verified salary data published"],
          ["Internship stipend", (career: Career) => career.stipend ? "Verified stipend data listed" : "No verified stipend data published"],
          ["Learning project", (career: Career) => career.projects[0] ?? "No project prompt listed"],
        ].map(([label, getValue]) => <div className="comparison-row" key={label as string}><div className="comparison-label">{label as string}</div>{selected.map((career) => <div className="comparison-cell" key={career.id}>{(getValue as (career: Career) => string)(career)}</div>)}</div>)}
      </div>
      <p className="tiny-note">Profession descriptions, qualifications and skill groupings are not yet independently verified. Salary and stipend figures are omitted until source-verified.</p>
    </div>
  );
}
