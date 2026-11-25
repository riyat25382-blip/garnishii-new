"use client";

import { industries } from "@/data/industries";

type Props = {
  industry: string;
  field: string;
  education: string;
  salary: string;
  stipend: string;
  skill: string;
  sort: string;
  fields: string[];
  skills: string[];
  hasVerifiedSalary: boolean;
  hasVerifiedStipend: boolean;
  onChange: (field: "industry" | "field" | "education" | "salary" | "stipend" | "skill" | "sort", value: string) => void;
  onReset: () => void;
};

export default function FilterPanel({
  industry, field, education, salary, stipend, skill, sort, fields, skills,
  hasVerifiedSalary, hasVerifiedStipend, onChange, onReset,
}: Props) {
  return (
    <details className="filter-disclosure">
      <summary>Refine your results <span>Optional filters</span></summary>
      <div className="filter-panel">
        <div className="filter-heading"><div><span className="overline">Make it yours</span><h2>Filters</h2></div><button type="button" onClick={onReset} className="reset-button">Clear all</button></div>
        <label className="filter-label">Industry
          <select value={industry} onChange={(event) => onChange("industry", event.target.value)}>
            <option value="">All industries</option>
            {industries.map((item) => <option key={item.slug} value={item.name}>{item.name}</option>)}
          </select>
        </label>
        <label className="filter-label">Career field
          <select value={field} onChange={(event) => onChange("field", event.target.value)}>
            <option value="">All fields</option>
            {fields.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="filter-label">Qualification information
          <select value={education} onChange={(event) => onChange("education", event.target.value)}>
            <option value="">Any status</option>
            <option value="needs-verification">Needs verification</option>
            <option value="verified">Verified</option>
          </select>
        </label>
        <label className="filter-label">Skill
          <select value={skill} onChange={(event) => onChange("skill", event.target.value)}>
            <option value="">Any skill</option>
            {skills.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="filter-label">Salary range
          <select value={salary} onChange={(event) => onChange("salary", event.target.value)} disabled={!hasVerifiedSalary}>
            <option value="">{hasVerifiedSalary ? "Any verified range" : "No verified salary data yet"}</option>
            {hasVerifiedSalary && <><option value="under-5">Under ₹5 LPA</option><option value="5-10">₹5–10 LPA</option><option value="over-10">Over ₹10 LPA</option></>}
          </select>
        </label>
        <label className="filter-label">Internship stipend
          <select value={stipend} onChange={(event) => onChange("stipend", event.target.value)} disabled={!hasVerifiedStipend}>
            <option value="">{hasVerifiedStipend ? "Any stipend" : "No verified stipend data yet"}</option>
            {hasVerifiedStipend && <option value="verified">Verified stipend listed</option>}
          </select>
        </label>
        <label className="filter-label filter-sort">Sort by
          <select value={sort} onChange={(event) => onChange("sort", event.target.value)}>
            <option value="relevance">Relevance</option>
            <option value="title">Profession name A–Z</option>
            <option value="industry">Industry, then name</option>
          </select>
        </label>
        <p className="filter-note">Salary and stipend filters will appear when source-verified figures are added. We do not estimate or invent amounts.</p>
      </div>
    </details>
  );
}
