import type { Career } from "@/data/careers";

export default function SalaryBreakdown({ career }: { career: Career }) {
  return (
    <section className="detail-section" id="salary">
      <div className="section-heading">
        <span className="overline">Pay information</span>
        <h2>Salary by experience</h2>
        <p>Garnishii only publishes salary information when a source and context can be checked.</p>
      </div>
      {career.salary.length
        ? <div className="salary-grid">{career.salary.map((item) => <article className="salary-card" key={`${item.level}-${item.source}`}><span className="salary-level">{item.level}</span><strong>{item.range}</strong><small>{item.note} · {item.source} · checked {item.observedAt}</small></article>)}</div>
        : <div className="data-unavailable"><strong>No verified salary data published</strong><p>We will not estimate or invent a pay range. Salary depends on role scope, experience, location, sector and source date. Check current, comparable sources before making a decision.</p></div>}
      <p className="tiny-note">Data status: {career.salary.length ? "source attached; review the stated context" : "no verified source attached"}.</p>
    </section>
  );
}
