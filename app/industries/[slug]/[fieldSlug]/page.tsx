import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { careerTaxonomy } from "@/data/career-taxonomy";
import { slugify } from "@/lib/utils";

export function generateStaticParams() {
  return careerTaxonomy.flatMap((industry) =>
    industry.fields.map((field) => ({ slug: industry.slug, fieldSlug: slugify(field.name) })),
  );
}

export async function generateMetadata({ params }: PageProps<"/industries/[slug]/[fieldSlug]">): Promise<Metadata> {
  const { slug, fieldSlug } = await params;
  const industry = careerTaxonomy.find((item) => item.slug === slug);
  const field = industry?.fields.find((item) => slugify(item.name) === fieldSlug);
  return field ? { title: field.name, description: `${field.name} professions in ${industry?.name}.` } : {};
}

export default async function CareerFieldPage({ params }: PageProps<"/industries/[slug]/[fieldSlug]">) {
  const { slug, fieldSlug } = await params;
  const industry = careerTaxonomy.find((item) => item.slug === slug);
  const field = industry?.fields.find((item) => slugify(item.name) === fieldSlug);
  if (!industry || !field) notFound();

  return <div className="page-shell industry-page">
    <nav className="breadcrumb taxonomy-breadcrumb" aria-label="Breadcrumb"><Link href="/explore">Explore</Link><span>/</span><Link href={`/industries/${industry.slug}`}>{industry.name}</Link><span>/</span><span>{field.name}</span></nav>
    <section className="industry-hero"><span className="overline">{industry.name}</span><h1>{field.name.toLowerCase()}.</h1><p>Browse specialisations within this field, then open a profession guide for a closer look. Profession-level facts are still being verified.</p></section>
    <div className="results-heading"><div><span className="overline">Choose a specialisation</span><h2>Follow a narrower thread.</h2></div><span className="results-count">{field.specializations.length} groups</span></div>
    <div className="taxonomy-card-grid">
      {field.specializations.map((specialization) => {
        const specializationSlug = slugify(specialization.name);
        return <Link className="taxonomy-card" href={`/industries/${industry.slug}/${fieldSlug}/${specializationSlug}`} key={specializationSlug}>
          <span className="taxonomy-card-icon">{industry.icon}</span>
          <span className="overline">{specialization.professions.length} professions</span>
          <strong>{specialization.name}</strong>
          <small>{specialization.overview}</small>
        </Link>;
      })}
    </div>
  </div>;
}
