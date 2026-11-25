import type { Metadata } from "next";
import SavedCareersView from "@/components/SavedCareersView";
import { careers } from "@/data/careers";

export const metadata: Metadata = { title: "Saved careers" };

export default function SavedPage() {
  return <div className="page-shell secondary-page"><section className="page-intro"><span className="overline">A little corner of your own</span><h1>Keep the paths<br /><em>that feel like maybe.</em></h1><p>Save what sparks your curiosity. Your list stays on this device.</p></section><SavedCareersView careers={careers} /></div>;
}
