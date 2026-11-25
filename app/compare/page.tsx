import type { Metadata } from "next";
import CompareCareersView from "@/components/CompareCareersView";
import { careers } from "@/data/careers";

export const metadata: Metadata = { title: "Compare careers" };

export default function ComparePage() {
  return <div className="page-shell secondary-page"><section className="page-intro"><span className="overline">A side-by-side view</span><h1>Compare professions<br /><em>on your mind.</em></h1><p>Put up to three possibilities next to each other. Unverified information and missing salary or stipend data are identified clearly.</p></section><CompareCareersView careers={careers} /></div>;
}
