import type { Metadata } from "next";
import { Suspense } from "react";
import ExploreBrowser from "@/components/ExploreBrowser";
import { careers } from "@/data/careers";
import { industries } from "@/data/industries";

export const metadata: Metadata = { title: "Explore careers" };

export default function ExplorePage() {
  return <div className="page-shell explore-page"><section className="page-intro"><span className="overline">A map of possibilities</span><h1>Explore work, one<br /><em>field at a time.</em></h1><p>Search professions, skills and industries, or browse a structured map from industry to field to specialisation.</p><span className="taxonomy-count">{careers.length} profession entries across {industries.length} industries · role details are marked by verification status</span></section><Suspense fallback={<div className="empty-state" aria-label="Loading career paths">Loading career paths…</div>}><ExploreBrowser careers={careers} /></Suspense></div>;
}
