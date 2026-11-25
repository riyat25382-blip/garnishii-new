import Link from "next/link";
import CareerCard from "@/components/CareerCard";
import IndustryCard from "@/components/IndustryCard";
import SearchBar from "@/components/SearchBar";
import { careers } from "@/data/careers";
import { industries } from "@/data/industries";

const steps = [
  { number: "01", title: "Start with a question", text: "Search a role, a skill, an industry, or simply something you would like to learn more about." },
  { number: "02", title: "Follow the taxonomy", text: "Move from an industry to fields, specialisations and distinct profession guides." },
  { number: "03", title: "Check what is verified", text: "Use source and status notes to tell discovery prompts apart from confirmed requirements." },
];

const popularSlugs = ["product-manager", "ux-designer", "data-analyst", "frontend-developer"];
const emergingSlugs = ["ai-ml-engineer", "renewable-energy-engineer", "drone-mapping-specialist"];

function findRoles(slugs: string[]) {
  return slugs.map((slug) => careers.find((career) => career.slug === slug)).filter((career) => career !== undefined);
}

export default function Home() {
  const featuredIndustries = industries.slice(0, 10);
  const popular = findRoles(popularSlugs);
  const emerging = findRoles(emergingSlugs);
  const industryCounts = new Map(industries.map((industry) => [
    industry.name,
    careers.filter((career) => career.industry === industry.name).length,
  ]));

  return <>
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-copy">
          <span className="hero-kicker"><span className="kicker-dot" /> A calm guide to India’s professions</span>
          <h1>Explore work<br />with <em>curiosity.</em></h1>
          <p className="hero-intro">A clearer map of industries, fields, specialisations and the professions within them. Start broad, then follow what feels interesting.</p>
          <SearchBar />
          <div className="hero-proof"><span>Structured discovery taxonomy</span><span className="proof-star">✳</span><span>Details clearly marked when unverified</span></div>
        </div>
        <div className="hero-art" aria-label="Illustration of the many possible paths ahead">
          <div className="art-sun">✳</div><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <div className="art-note note-top"><span className="note-icon">✿</span><span>start with<br /><strong>what makes you curious</strong></span></div>
          <div className="art-person"><div className="person-hair" /><div className="person-face"><span className="person-eye" /><span className="person-eye" /><span className="person-smile" /></div><div className="person-body" /><div className="person-arm" /></div>
          <div className="art-note note-bottom"><span className="note-icon">✳</span><span>one field at a time<br /><strong>no rush to decide</strong></span></div>
          <span className="art-scribble">a map, not<br />a test</span>
        </div>
        <span className="hero-side-note">A place to explore, not a test to pass.</span>
      </div>
      <div className="hero-bottom"><span>INDUSTRY / FIELD / SPECIALISATION / PROFESSION</span><span className="hero-bottom-line" /><span>{careers.length} ENTRIES</span></div>
    </section>

    <section className="discovery-section" aria-labelledby="discovery-title">
      <div className="discovery-inner">
        <div><span className="overline">Choose your starting point</span><h2 id="discovery-title">There’s no single way in.</h2></div>
        <div className="discovery-options">
          <Link href="/explore#industries"><span>01</span><strong>Browse industries</strong><small>Explore the wider world of work</small></Link>
          <Link href="/explore#career-search"><span>02</span><strong>Search a skill or role</strong><small>Start with a word you already know</small></Link>
          <Link href="/compare"><span>03</span><strong>Compare possibilities</strong><small>Keep a few paths side by side</small></Link>
        </div>
      </div>
    </section>

    <section className="section industries-section" id="industries">
      <div className="section-heading section-heading--row"><div><span className="overline">A world of possibilities</span><h2>Start with a field<br />that catches your eye.</h2></div><p>Browse a few starting points here, or open the full industry map and narrow down from there.</p></div>
      <div className="industry-grid">{featuredIndustries.map((industry) => <IndustryCard key={industry.slug} industry={industry} count={industryCounts.get(industry.name) ?? 0} />)}</div>
      <div className="section-link-row"><span>{industries.length} industries in the full taxonomy.</span><Link href="/explore#industries">Browse all industries</Link></div>
    </section>

    <section className="section popular-section">
      <div className="section-heading section-heading--row"><div><span className="overline">A few places to begin</span><h2>Professions to<br />get curious about.</h2></div><Link className="button button--outline" href="/explore">Explore all professions</Link></div>
      <div className="career-grid">{popular.map((career) => <CareerCard key={career.id} career={career} featured />)}</div>
    </section>

    <section className="emerging-section"><div className="emerging-content"><div><span className="overline overline--light">Work keeps changing</span><h2>New questions.<br /><em>New kinds of work.</em></h2><p>Explore some cross-disciplinary and emerging roles. Their titles and routes can shift, so check the verification notes on each guide.</p><Link className="button button--light" href="/industries/emerging-and-unconventional-careers">Explore emerging careers</Link></div><div className="emerging-stack">{emerging.map((career, index) => <Link href={`/careers/${career.slug}`} key={career.id} className={`emerging-card emerging-card--${index}`}><span className={`career-icon tone-${career.tone}`}>{career.icon}</span><span><small>{career.industry}</small><strong>{career.title}</strong></span></Link>)}</div></div><span className="emerging-flower">✳</span></section>

    <section className="section how-section"><div className="section-heading"><span className="overline">No pressure. Just possibility.</span><h2>Follow a question.<br /><em>Not a perfect plan.</em></h2></div><div className="steps-grid">{steps.map((step) => <article className="step-card" key={step.number}><span>{step.number}</span><div className="step-spark">✳</div><h3>{step.title}</h3><p>{step.text}</p></article>)}</div><div className="how-end"><span>Career exploration is a process, not a test.</span><Link href="/about">Get to know Garnishii</Link></div></section>

    <section className="closing-cta"><span className="closing-flower">✳</span><span className="overline">A thoughtful starting point</span><h2>See what’s out<br /><em>there for you.</em></h2><p className="closing-note">Profession counts are taxonomy entries. Career requirements and market figures are shown only when supported by verified sources.</p><Link className="button button--dark" href="/explore">Explore professions</Link></section>
  </>;
}
