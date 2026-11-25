import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CareerCard from "@/components/CareerCard";
import { careerBySlug } from "@/data/careers";
import { careerTaxonomy } from "@/data/career-taxonomy";
import { slugify } from "@/lib/utils";

type Props = PageProps<"/industries/[slug]/[fieldSlug]/[specializationSlug]">;

export function generateStaticParams() {
  return careerTaxonomy.flatMap((industry) =>
    industry.fields.flatMap((field) =>
      field.specializations.map((specialization) => ({
        slug: industry.slug,
        fieldSlug: slugify(field.name),
        specializationSlug: slugify(specialization.name),
      })),
    ),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, fieldSlug, specializationSlug } = await params;
  const industry = careerTaxonomy.find((item) => item.slug === slug);
  const field = industry?.fields.find((item) => slugify(item.name) === fieldSlug);
  const specialization = field?.specializations.find((item) => slugify(item.name) === specializationSlug);
  return specialization ? { title: specialization.name, description: specialization.overview } : {};
}

export default async function SpecializationPage({ params }: Props) {
  const { slug, fieldSlug, specializationSlug } = await params;
  const industry = careerTaxonomy.find((item) => item.slug === slug);
  const field = industry?.fields.find((item) => slugify(item.name) === fieldSlug);
  const specialization = field?.specializations.find((item) => slugify(item.name) === specializationSlug);
  if (!industry || !field || !specialization) notFound();

  const professions = specialization.professions
    .map((title) => careerBySlug(slugify(title)))
    .filter((career) => career !== undefined);

  return <div className="page-shell industry-page">
    <nav className="breadcrumb taxonomy-breadcrumb" aria-label="Breadcrumb">
      <Link href="/explore">Explore</Link><span>/</span>
      <Link href={`/industries/${industry.slug}`}>{industry.name}</Link><span>/</span>
      <Link href={`/industries/${industry.slug}/${fieldSlug}`}>{field.name}</Link><span>/</span>
      <span>{specialization.name}</span>
    </nav>
    <section className="industry-hero"><span className="overline">{industry.name} · {field.name}</span><h1>{specialization.name.toLowerCase()}.</h1><p>{specialization.overview} Each profession guide indicates which details have not yet been verified.</p></section>
    <div className="results-heading"><div><span className="overline">Individual professions</span><h2>Choose a role to explore.</h2></div><span className="results-count">{professions.length} entries</span></div>
    {professions.length ? <div className="career-grid career-grid--explore">{professions.map((career) => <CareerCard key={career.id} career={career} />)}</div> : <div className="empty-state"><h2>Profession records are being prepared</h2><p>Return to this specialisation later.</p></div>}
  </div>;
}
