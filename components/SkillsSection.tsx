import type { Career } from "@/data/careers";

const groupLabels = [
  ["core", "Core discipline"],
  ["additional", "Additional foundations"],
  ["transferable", "Transferable skills"],
] as const;

export default function SkillsSection({ career }: { career: Career }) {
  return (
    <section className="detail-section">
      <div className="section-heading">
        <span className="overline">Ideas to investigate</span>
        <h2>Skills and capabilities</h2>
        <p>These are taxonomy suggestions, not verified employer requirements or a ranking of importance.</p>
      </div>
      <div className="skill-group-list">
        {groupLabels.map(([key, label]) => {
          const skills = career.skillGroups[key];
          if (!skills.length) return null;
          return <div className="skill-group" key={key}>
            <h3>{label}</h3>
            <div className="detail-skill-grid">{skills.map((skill, index) => <article className="detail-skill" key={skill}>
              <span className={`skill-number tone-${career.tone}`}>{String(index + 1).padStart(2, "0")}</span>
              <div><strong>{skill}</strong><p>Explore how this may relate to {career.specialization.toLowerCase()}; confirm priorities using current role information.</p></div>
            </article>)}</div>
          </div>;
        })}
      </div>
      <p className="tiny-note">Skill groupings are unverified learning prompts. Employers may use different terms or prioritise different capabilities.</p>
    </section>
  );
}
