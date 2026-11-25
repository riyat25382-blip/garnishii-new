import type { Career } from "@/data/careers";

export default function CareerRoadmap({ career }: { career: Career }) {
  return (
    <section className="detail-section">
      <div className="section-heading"><span className="overline">Small steps, real progress</span><h2>A roadmap to get started</h2><p>General exploration guidance, not a verified qualification route. Confirm formal requirements before acting.</p></div>
      <div className="roadmap">
        {career.roadmap.map((step, index) => <div className="roadmap-step" key={step.title}><span className="roadmap-index">0{index + 1}</span><div><h3>{step.title}</h3><p>{step.detail}</p></div></div>)}
      </div>
    </section>
  );
}
