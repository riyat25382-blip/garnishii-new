import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import CareerCard from "@/components/CareerCard";
import CareerRoadmap from "@/components/CareerRoadmap";
import SalaryBreakdown from "@/components/SalaryBreakdown";
import SkillsSection from "@/components/SkillsSection";
import { CompareButton, SaveButton } from "@/components/ClientControls";
import { careers, careerBySlug } from "@/data/careers";
import { slugify } from "@/lib/utils";

const sections = [
  ["overview", "Overview"],
  ["responsibilities", "Responsibilities"],
  ["skills", "Skills"],
  ["work-settings", "Work settings"],
  ["education", "Education"],
  ["tools", "Tools"],
  ["internships", "Internships"],
  ["salary", "Salary"],
  ["roadmap", "Learning roadmap"],
  ["projects", "Projects"],
  ["growth", "Career growth"],
  ["market-context", "Market context"],
  ["related", "Related professions"],
  ["sources", "Sources and verification"],
];

export function generateStaticParams() {
  return careers.map((career) => ({ slug: career.slug }));
}

export async function generateMetadata({ params }: PageProps<"/careers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const career = careerBySlug(slug);
  return career ? { title: career.title, description: career.description } : {};
}

export default function CareerPage({ params }: PageProps<"/careers/[slug]">) {
  return <Suspense fallback={<div className="page-shell empty-state">Loading profession guide…</div>}><CareerPageContent params={params} /></Suspense>;
}

async function CareerPageContent({ params }: Pick<PageProps<"/careers/[slug]">, "params">) {
  const { slug } = await params;
  const career = careerBySlug(slug);
  if (!career) notFound();

  const related = career.related
    .map((relatedSlug) => careerBySlug(relatedSlug))
    .filter((item) => item && item.slug !== career.slug)
    .slice(0, 3);

  return (
    <div className="profession-page">
      <header className="profession-hero">
        <div className="profession-hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/explore">Explore</Link><span>/</span>
            <Link href={`/industries/${career.industrySlug}`}>{career.industry}</Link><span>/</span>
            <Link href={`/industries/${career.industrySlug}/${career.fieldSlug}`}>{career.field}</Link><span>/</span>
            <span>{career.title}</span>
          </nav>
          <div className="profession-hero-copy">
            <span className="overline">Profession guide · India</span>
            <h1>{career.title}</h1>
            <p>{career.description}</p>
            <div className="taxonomy-trail">
              <Link href={`/industries/${career.industrySlug}`}>{career.industry}</Link>
              <span>{career.field}</span>
              <Link href={`/industries/${career.industrySlug}/${career.fieldSlug}/${slugify(career.specialization)}`}>{career.specialization}</Link>
            </div>
            <div className="verification-pill" role="status">
              {career.sources.length
                ? "Needs verification · references listed; guide content is not fully reviewed"
                : "Needs verification · no sourced facts published yet"}
            </div>
            <div className="profession-actions">
              <SaveButton careerId={career.id} />
              <CompareButton careerId={career.id} />
              <Link className="button button--dark" href="#roadmap">Explore possible next steps</Link>
            </div>
          </div>
          <div className="profession-summary">
            <div><span>INDUSTRY</span><strong>{career.industry}</strong></div>
            <div><span>FIELD</span><strong>{career.field}</strong></div>
            <div><span>SALARY DATA</span><strong>Not verified</strong></div>
            <div><span>ENTRY ROUTE</span><strong>Not verified</strong></div>
          </div>
        </div>
      </header>

      <div className="profession-layout">
        <nav className="profession-toc" aria-label="On this page">
          <strong>On this page</strong>
          {sections.map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}
        </nav>
        <main className="profession-content">
          <details className="profession-mobile-toc">
            <summary>On this page</summary>
            <nav aria-label="Profession sections">{sections.map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}</nav>
          </details>

          <section className="profession-section" id="overview">
            <span className="overline">The big picture</span>
            <h2>What is this profession about?</h2>
            <p>{career.specialization} is the closest listed specialisation in this discovery taxonomy. {career.description}</p>
            <p className="verification-note">This is an orientation summary generated from the taxonomy, not a verified job description. Exact scope varies and has not been independently checked.</p>
          </section>

          <section className="profession-section" id="responsibilities">
            <span className="overline">A closer look</span>
            <h2>Possible areas of work</h2>
            <p className="section-lead">These broad prompts help you investigate the role. They are not confirmed duties for every employer.</p>
            <ul className="profession-list">{career.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>

          <div id="skills"><SkillsSection career={career} /></div>

          <section className="profession-section" id="work-settings">
            <span className="overline">Where work happens</span>
            <h2>Work settings and employers</h2>
            <p>No profession-specific employer, sector, location or work-arrangement details have been verified for this page. Check current job descriptions and official sector information before drawing conclusions.</p>
          </section>

          <section className="profession-section" id="education">
            <span className="overline">Plan with context</span>
            <h2>Education and qualifications</h2>
            <p>There is no verified entry route published here. The exact qualification, accreditation, entrance exam, registration or experience requirements may depend on the role and location.</p>
            <ul className="profession-list">{career.qualifications.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="verification-note">Confirm requirements with the relevant official regulator, recognised institution and current employer before enrolling or applying.</p>
          </section>

          <section className="profession-section" id="tools">
            <span className="overline">The workbench</span>
            <h2>Tools and technology</h2>
            <p>No profession-specific tools have been verified yet. Look for recurring tools in current job descriptions, and distinguish required tools from examples or employer preferences.</p>
          </section>

          <section className="profession-section" id="internships">
            <span className="overline">Early experience</span>
            <h2>Internships and stipends</h2>
            <p>No verified internship or stipend data is available for this profession. Availability, eligibility and compensation can vary by employer, location and programme.</p>
          </section>

          <SalaryBreakdown career={career} />

          <div id="roadmap"><CareerRoadmap career={career} /></div>

          <section className="profession-section" id="projects">
            <span className="overline">Learn by making</span>
            <h2>Project ideas to try</h2>
            <p>Optional learning prompts, not hiring requirements. Use appropriate supervision and safety practices for any real-world activity.</p>
            <div className="project-grid">{career.projects.map((project, index) => <article className="project-card" key={project}><span>{String(index + 1).padStart(2, "0")}</span><p>{project}</p></article>)}</div>
          </section>

          <section className="profession-section" id="growth">
            <span className="overline">Room to grow</span>
            <h2>Possible directions over time</h2>
            <p>These are broad learning stages, not a verified promotion ladder or promise of progression.</p>
            <div className="growth-path">{career.growth.map((step, index) => <div className="growth-step" key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></div>)}</div>
          </section>

          <section className="profession-section" id="market-context">
            <span className="overline">The wider picture</span>
            <h2>Employment and market context</h2>
            <p>{career.marketContext}</p>
            <p>Garnishii does not currently publish hiring volume, in-demand locations, employer lists or employment-sector classifications for this role.</p>
          </section>

          {related.length > 0 && <section className="profession-section" id="related">
            <span className="overline">Keep exploring</span>
            <h2>Related professions</h2>
            <p>These roles share a taxonomy specialisation or field. Similarity does not guarantee similar qualifications or daily work.</p>
            <div className="career-grid career-grid--explore">{related.map((item) => item && <CareerCard key={item.id} career={item} />)}</div>
          </section>}

          <section className="profession-section source-section" id="sources">
            <span className="overline">Transparency first</span>
            <h2>Sources and verification</h2>
            <dl className="source-metadata">
              <div><dt>Information status</dt><dd>Needs verification</dd></div>
              <div><dt>Source records</dt><dd>{career.sources.length ? `${career.sources.length} sources listed` : "No sources attached to this page"}</dd></div>
              <div><dt>Confidence</dt><dd>Not assessed</dd></div>
              <div><dt>Geographic scope</dt><dd>{career.applicability}</dd></div>
              <div><dt>Taxonomy date</dt><dd>{career.updated}</dd></div>
            </dl>
            {career.sources.length > 0 && (
              <ul className="source-list">
                {career.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer">{source.label}</a>
                    <span>Checked {source.checkedAt}</span>
                    <p>Supports: {source.coverage.join("; ")}</p>
                  </li>
                ))}
              </ul>
            )}
            <p className="verification-note">This date refers to the taxonomy listing only; it is not a verification date for job duties, education, pay or hiring information. Salary and stipend figures are omitted unless supported by a source that can be checked.</p>
          </section>
        </main>
      </div>
    </div>
  );
}
