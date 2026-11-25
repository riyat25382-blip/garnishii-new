import Link from "next/link";
import type { Career } from "@/data/careers";
import { CompareButton, SaveButton } from "./ClientControls";

export default function CareerCard({ career, featured = false }: { career: Career; featured?: boolean }) {
  return (
    <article className={`career-card ${featured ? "career-card--featured" : ""}`}>
      <div className="card-topline"><Link className="eyebrow-link" href={`/industries/${career.industrySlug}`}>{career.industry}</Link><SaveButton careerId={career.id} compact /></div>
      <Link href={`/careers/${career.slug}`} className="career-card-link">
        <div className={`career-icon tone-${career.tone}`}>{career.icon}</div>
        <h3>{career.title}</h3>
        <p>{career.description}</p>
        <div className="skill-pills">{career.skills.slice(0, 3).map((skill) => <span key={skill}>{skill}</span>)}</div>
        <span className="card-arrow">Open profession guide</span>
      </Link>
      <div className="card-actions"><span className="career-category">{career.field}</span><CompareButton careerId={career.id} /></div>
    </article>
  );
}
