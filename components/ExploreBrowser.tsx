"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Career } from "@/data/careers";
import { careerTaxonomy } from "@/data/career-taxonomy";
import { careerBySlug } from "@/data/careers";
import { industries } from "@/data/industries";
import IndustryCard from "@/components/IndustryCard";
import { filterCareers } from "@/lib/career-filters";
import { slugify } from "@/lib/utils";
import CareerCard from "./CareerCard";
import FilterPanel from "./FilterPanel";

const featuredSlugs = [
  "product-manager", "ux-designer", "data-analyst", "frontend-developer",
  "public-health-researcher", "financial-analyst", "architect", "renewable-energy-engineer",
  "social-worker", "game-developer", "electrician", "fashion-designer",
];

export default function ExploreBrowser({ careers }: { careers: Career[] }) {
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [industry, setIndustry] = useState("");
  const [field, setField] = useState("");
  const [education, setEducation] = useState("");
  const [salary, setSalary] = useState("");
  const [stipend, setStipend] = useState("");
  const [skill, setSkill] = useState("");
  const [sort, setSort] = useState("relevance");
  const [focused, setFocused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(36);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const filtered = useMemo(
    () => filterCareers(careers, { query, industry, field, education, salary, stipend, skill, sort }),
    [careers, query, industry, field, education, salary, stipend, skill, sort],
  );
  const fields = useMemo(() => [...new Set(careers.map((career) => career.field))].sort(), [careers]);
  const skills = useMemo(() => [...new Set(careers.flatMap((career) => career.skills))].sort(), [careers]);
  const hasActiveFilters = Boolean(industry || field || education || salary || stipend || skill || sort !== "relevance");
  const searching = Boolean(query.trim() || hasActiveFilters);
  const featuredCareers = featuredSlugs.map((slug) => careerBySlug(slug)).filter((career): career is Career => Boolean(career));
  const suggestions = query.trim()
    ? filterCareers(careers, { query, industry: "", field: "", education: "", salary: "", stipend: "", skill: "", sort: "relevance" }).slice(0, 5)
    : [];
  const industrySuggestions = query.trim()
    ? industries.filter((item) => item.name.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 3)
    : [];
  const fieldSuggestions = query.trim()
    ? careerTaxonomy.flatMap((item) => item.fields.map((careerField) => ({ industry: item, field: careerField })))
      .filter(({ industry: item, field: careerField }) =>
        `${careerField.name} ${item.name}`.toLowerCase().includes(query.trim().toLowerCase()),
      ).slice(0, 3)
    : [];
  const industryCounts = useMemo(
    () => new Map(industries.map((item) => [item.name, careers.filter((career) => career.industry === item.name).length])),
    [careers],
  );

  function change(
    filter: "industry" | "field" | "education" | "salary" | "stipend" | "skill" | "sort",
    value: string,
  ) {
    if (filter === "industry") setIndustry(value);
    if (filter === "field") setField(value);
    if (filter === "education") setEducation(value);
    if (filter === "salary") setSalary(value);
    if (filter === "stipend") setStipend(value);
    if (filter === "skill") setSkill(value);
    if (filter === "sort") setSort(value);
    setVisibleCount(36);
  }

  function reset() {
    setQuery("");
    setIndustry("");
    setField("");
    setEducation("");
    setSalary("");
    setStipend("");
    setSkill("");
    setSort("relevance");
    setVisibleCount(36);
  }

  return (
    <div className="explore-browser">
      <div className="explore-search-wrap">
        <div className="explore-search">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <label className="sr-only" htmlFor="career-search">Search professions, fields, industries or skills</label>
          <input
            ref={inputRef}
            id="career-search"
            className="explore-live-search"
            value={query}
            onFocus={() => setFocused(true)}
            onBlur={() => window.setTimeout(() => setFocused(false), 140)}
            onChange={(event) => { setQuery(event.target.value); setVisibleCount(36); }}
            placeholder="Search professions, industries, fields or skills"
            autoComplete="off"
          />
          {query && <button className="search-clear" type="button" onClick={reset} aria-label="Clear search">Clear</button>}
          <span className="search-shortcut">⌘ K</span>
        </div>
        {focused && query.trim() && <div className="search-suggestions" role="list">
          {suggestions.map((career) => <Link role="listitem" href={`/careers/${career.slug}`} key={career.slug}><strong>{career.title}</strong><span>{career.field} · {career.industry}</span></Link>)}
          {fieldSuggestions.map(({ industry: item, field: careerField }) => <Link role="listitem" href={`/industries/${item.slug}/${slugify(careerField.name)}`} key={`${item.slug}-${careerField.name}`}><strong>{careerField.name}</strong><span>Field · {item.name}</span></Link>)}
          {industrySuggestions.map((item) => <Link role="listitem" href={`/industries/${item.slug}`} key={item.slug}><strong>{item.name}</strong><span>Industry · Browse fields</span></Link>)}
          {!suggestions.length && !fieldSuggestions.length && !industrySuggestions.length && <span className="suggestion-empty">No close matches. Try a broader term.</span>}
        </div>}
      </div>

      <FilterPanel
        industry={industry}
        field={field}
        education={education}
        salary={salary}
        stipend={stipend}
        skill={skill}
        sort={sort}
        fields={fields}
        skills={skills}
        hasVerifiedSalary={careers.some((career) => career.salary.length > 0)}
        hasVerifiedStipend={careers.some((career) => career.stipend !== null)}
        onChange={change}
        onReset={reset}
      />

      {searching ? <section className="explore-results" aria-live="polite">
        <div className="results-heading">
          <div><span className="overline">{query.trim() ? "Search results" : "Filtered paths"}</span><h2>{filtered.length} professions to explore</h2></div>
          <span className="results-count">Showing {Math.min(visibleCount, filtered.length)} of {filtered.length}</span>
        </div>
        {filtered.length
          ? <div className="career-grid career-grid--explore">{filtered.slice(0, visibleCount).map((career) => <CareerCard key={career.id} career={career} />)}</div>
          : <div className="empty-state"><span>⌕</span><h3>No matching professions</h3><p>Try a different search or clear a filter. Salary and stipend ranges are not listed until verified.</p><button className="button button--dark" onClick={reset}>Clear search and filters</button></div>}
        {filtered.length > visibleCount && <button className="button button--outline load-more" onClick={() => setVisibleCount((count) => count + 36)}>Show 36 more</button>}
      </section> : <>
        <section className="explore-browse-section" id="industries">
          <div className="results-heading"><div><span className="overline">Start broad, then narrow in</span><h2>Browse by industry</h2></div><span className="results-count">{industries.length} industries</span></div>
          <div className="industry-grid">{industries.map((item) => <IndustryCard key={item.slug} industry={item} count={industryCounts.get(item.name) ?? 0} />)}</div>
        </section>
        <section className="explore-browse-section">
          <div className="results-heading"><div><span className="overline">A few starting points</span><h2>Professions to get curious about</h2></div><span className="results-count">{featuredCareers.length} examples</span></div>
          <div className="career-grid career-grid--explore">{featuredCareers.map((career) => <CareerCard key={career.id} career={career} />)}</div>
        </section>
      </>}
    </div>
  );
}
