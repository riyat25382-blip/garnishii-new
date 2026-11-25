import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { careerTaxonomy } from "@/data/career-taxonomy";
import { slugify } from "@/lib/utils";

export function generateStaticParams() {
  return careerTaxonomy.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: PageProps<"/industries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const industry = careerTaxonomy.find((item) => item.slug === slug);
  return industry ? { title: industry.name, description: industry.description } : {};
}

export default async function IndustryPage({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const industry = careerTaxonomy.find((item) => item.slug === slug);
  if (!industry) notFound();

  const professionCount = industry.fields.reduce(
    (total, item) => total + item.specializations.reduce((count, group) => count + group.professions.length, 0),
    0,
  );

  return (
    <div className="page-shell industry-page">
      <Link href="/explore" className="back-link">All industries</Link>
      <section className="industry-hero">
        <span className={`industry-icon industry-icon--large tone-${industry.color}`}>{industry.icon}</span>
        <span className="overline">{professionCount} profession entries · needs verification</span>
        <h1>Explore<br /><em>{industry.name.toLowerCase()}.</em></h1>
        <p>{industry.description} Start with a broad field, then follow a specialisation to individual professions.</p>
      </section>
      <div className="results-heading">
        <div><span className="overline">Choose a field</span><h2>Explore by discipline.</h2></div>
        <span className="results-count">{industry.fields.length} fields</span>
      </div>
      <div className="taxonomy-card-grid">
        {industry.fields.map((item) => {
          const fieldCount = item.specializations.reduce((total, group) => total + group.professions.length, 0);
          const fieldSlug = slugify(item.name);
          return <Link className="taxonomy-card" href={`/industries/${industry.slug}/${fieldSlug}`} key={fieldSlug}>
            <span className="taxonomy-card-icon">{industry.icon}</span>
            <span className="overline">{item.specializations.length} specialisations</span>
            <strong>{item.name}</strong>
            <small>{fieldCount} profession entries</small>
          </Link>;
        })}
      </div>
      <p className="taxonomy-disclaimer">This is a discovery taxonomy, not a verified list of every occupation or entry route in India. Role details are labelled where information is still unverified.</p>
    </div>
  );
}
