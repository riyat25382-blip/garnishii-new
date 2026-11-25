import Link from "next/link";
import type { Industry } from "@/data/industries";

export default function IndustryCard({ industry, count }: { industry: Industry; count: number }) {
  return (
    <Link href={`/industries/${industry.slug}`} className="industry-card">
      <span className={`industry-icon tone-${industry.color}`}>{industry.icon}</span>
      <span className="industry-copy"><strong>{industry.name}</strong><small>{count} professions · {industry.fieldCount} fields</small></span>
    </Link>
  );
}
