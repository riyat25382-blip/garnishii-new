import { careerTaxonomy, type SpecializationNode } from "./career-taxonomy";
import { slugify } from "@/lib/utils";

export type SalaryRecord = {
  level: string;
  range: string;
  note: string;
  source: string;
  observedAt: string;
};

export type StipendRecord = {
  amount: string;
  period: string;
  note: string;
  source: string;
  observedAt: string;
};

export type CareerSource = {
  label: string;
  url: string;
  checkedAt: string;
  coverage: string[];
};

export type Career = {
  id: string;
  slug: string;
  title: string;
  industry: string;
  industrySlug: string;
  field: string;
  fieldSlug: string;
  category: string;
  specialization: string;
  specializationSlug: string;
  icon: string;
  tone: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  skillGroups: { core: string[]; additional: string[]; transferable: string[] };
  qualifications: string[];
  tools: string[];
  stipend: StipendRecord | null;
  salary: SalaryRecord[];
  education: string;
  roadmap: { title: string; detail: string }[];
  projects: string[];
  growth: string[];
  related: string[];
  sources: CareerSource[];
  verificationStatus: "needs-verification" | "verified";
  confidence: "unassessed" | "high" | "medium" | "low";
  applicability: string;
  updated: string;
  marketContext: string;
  workSettings: string[];
  employmentTypes: string[];
};

type ProfessionRecord = {
  title: string;
  industry: (typeof careerTaxonomy)[number];
  field: (typeof careerTaxonomy)[number]["fields"][number];
  specialization: SpecializationNode;
  slug: string;
};

const legacyIds: Record<string, string> = {
  "product-manager": "career-001",
  "frontend-developer": "career-002",
  "data-analyst": "career-003",
  "backend-developer": "career-004",
  "data-scientist": "career-005",
  "ai-ml-engineer": "career-006",
  "cybersecurity-analyst": "career-007",
  "ux-designer": "career-008",
  "visual-designer": "career-009",
  "motion-designer": "career-010",
  "brand-strategist": "career-011",
  "financial-analyst": "career-012",
  "business-analyst": "career-013",
  "investment-analyst": "career-014",
  accountant: "career-015",
  "public-health-researcher": "career-016",
  "clinical-research-associate": "career-017",
  "health-informatics-specialist": "career-018",
  nutritionist: "career-019",
  "content-strategist": "career-020",
  "social-media-manager": "career-021",
  "marketing-manager": "career-022",
  "content-creator": "career-023",
  "learning-experience-designer": "career-024",
  "education-researcher": "career-025",
  "academic-advisor": "career-026",
  "renewable-energy-engineer": "career-027",
  "civil-engineer": "career-028",
  "cloud-engineer": "career-029",
  "environmental-consultant": "career-030",
  "sustainability-analyst": "career-031",
  "urban-farmer": "career-032",
  "policy-researcher": "career-033",
  "legal-associate": "career-034",
  "compliance-analyst": "career-035",
  "hotel-operations-manager": "career-036",
  "travel-consultant": "career-037",
  "event-planner": "career-038",
};

const professionRecords: ProfessionRecord[] = careerTaxonomy.flatMap((industry) =>
  industry.fields.flatMap((careerField) =>
    careerField.specializations.flatMap((specialization) =>
      specialization.professions.map((title) => ({
        title,
        industry,
        field: careerField,
        specialization,
        slug: slugify(title),
      })),
    ),
  ),
);

const roleSlugCounts = new Map<string, number>();
for (const profession of professionRecords) {
  roleSlugCounts.set(profession.slug, (roleSlugCounts.get(profession.slug) ?? 0) + 1);
}

for (const [slug, count] of roleSlugCounts) {
  if (count > 1) {
    throw new Error(`Duplicate profession route "${slug}" in the career taxonomy.`);
  }
}
if (professionRecords.length < 250) {
  throw new Error(`Career taxonomy needs at least 250 professions; found ${professionRecords.length}.`);
}

const groupedRecords = new Map<string, ProfessionRecord[]>();
for (const record of professionRecords) {
  const key = `${record.industry.slug}/${slugify(record.field.name)}/${slugify(record.specialization.name)}`;
  groupedRecords.set(key, [...(groupedRecords.get(key) ?? []), record]);
}

function roadmapFor(record: ProfessionRecord) {
  const { industry, field, specialization } = record;
  const firstStep = `Explore the day-to-day scope of ${specialization.name.toLowerCase()} and compare how current employers describe the role.`;
  const secondStep = specialization.regulated
    ? "Check current eligibility, accreditation, registration and practice rules with the relevant official authority before choosing a course."
    : "Compare current employer requirements and recognised education or training options; entry routes vary by organisation and location.";

  if (industry.slug === "government-and-civil-services") {
    return [
      { title: "Understand the service", detail: `${specialization.overview} Service duties and recruitment routes differ; read the current official service and recruitment information.` },
      { title: "Verify eligibility", detail: "Use the latest official recruitment notice to check age, education, examinations and other eligibility conditions." },
      { title: "Build relevant foundations", detail: `Explore public administration, policy and communication alongside the role-related skills: ${specialization.skills.slice(0, 3).join(", ")}.` },
      { title: "Plan from official guidance", detail: "Use official syllabi and notices to decide whether preparation, an application or another route fits your circumstances." },
    ];
  }
  if (industry.slug === "healthcare-and-medicine" || industry.slug === "pharmacy-and-life-sciences") {
    return [
      { title: "Learn about the work", detail: specialization.overview },
      { title: "Check recognised routes", detail: "Confirm current course recognition, entrance requirements, supervised practice and any registration rules with the official regulator or institution." },
      { title: "Build foundations safely", detail: `Study relevant fundamentals such as ${specialization.skills.slice(0, 3).join(", ")} through recognised learning; do not practise beyond your training or authority.` },
      { title: "Seek supervised experience", detail: "Explore legitimate observation, research or supervised placements and verify the host organisation and applicable safeguards." },
    ];
  }
  if (industry.slug === "aviation-and-aerospace" || industry.slug === "defence-and-security") {
    return [
      { title: "Explore the role", detail: specialization.overview },
      { title: "Verify official requirements", detail: "Check the latest official recruitment, training, medical, licensing and safety requirements before committing to a route." },
      { title: "Build relevant foundations", detail: `Explore ${specialization.skills.slice(0, 3).join(", ")} through recognised, role-appropriate learning.` },
      { title: "Follow authorised pathways", detail: "Use official service, aviation or employer information for applications and training; requirements can change." },
    ];
  }
  if (industry.slug === "skilled-trades-and-technical-services") {
    return [
      { title: "Explore the craft", detail: specialization.overview },
      { title: "Find recognised training", detail: "Compare current vocational programmes, apprenticeship options and local requirements with recognised providers." },
      { title: "Practise with supervision", detail: `Build foundations in ${specialization.skills.slice(0, 3).join(", ")} with suitable instruction, equipment and safety supervision.` },
      { title: "Document practical learning", detail: "Keep a record of training and supervised work, and confirm any required assessment or certification with the relevant authority." },
    ];
  }
  if (industry.slug === "law-and-legal-services" || industry.slug === "education-and-teaching") {
    return [
      { title: "Understand the setting", detail: specialization.overview },
      { title: "Check formal requirements", detail: secondStep },
      { title: "Develop subject foundations", detail: `Explore ${specialization.skills.slice(0, 3).join(", ")} through relevant study and ethical practice.` },
      { title: "Learn in an appropriate setting", detail: "Look for legitimate, supervised opportunities and verify professional boundaries and safeguarding expectations." },
    ];
  }
  return [
    { title: "Explore the work", detail: firstStep },
    { title: "Check possible routes", detail: secondStep },
    { title: "Build useful foundations", detail: `Start exploring ${specialization.skills.slice(0, 3).join(", ")} through reputable learning and small practice activities.` },
    { title: "Create evidence and review", detail: `Try a small learning project related to ${field.name.toLowerCase()}, then compare your work with current role descriptions and seek informed feedback.` },
  ];
}

const taxonomyUpdated = "25 Nov 2026";

const reviewedSources: Partial<Record<string, CareerSource[]>> = {
  "registered-nurse": [
    {
      label: "Indian Nursing Council — Nursing Programs",
      url: "https://indiannursingcouncil.org/nursingprograms",
      checkedAt: "26 Nov 2026",
      coverage: ["Official list of nursing programme types and associated examination and registration categories; not a current, role-specific entry requirement."],
    },
  ],
};

export const careers: Career[] = professionRecords.map((record) => {
  const { title, industry, field, specialization } = record;
  const slug = record.slug;
  const groupKey = `${industry.slug}/${slugify(field.name)}/${slugify(specialization.name)}`;
  const peers = groupedRecords.get(groupKey) ?? [];
  const sameFieldPeers = professionRecords.filter(
    (other) => other.industry.slug === industry.slug && other.field.name === field.name && other.slug !== record.slug,
  );
  const related = [...peers, ...sameFieldPeers]
    .filter((other) => other.slug !== record.slug)
    .map((other) => other.slug)
    .filter((peerSlug, index, list) => list.indexOf(peerSlug) === index)
    .slice(0, 4);
  const skills = specialization.skills;

  return {
    id: legacyIds[slug] ?? `career-${slug}`,
    slug,
    title,
    industry: industry.name,
    industrySlug: industry.slug,
    field: field.name,
    fieldSlug: slugify(field.name),
    category: field.name,
    specialization: specialization.name,
    specializationSlug: slugify(specialization.name),
    icon: industry.icon,
    tone: industry.color,
    description: `${specialization.overview} A ${title.toLowerCase()} focuses on this work within ${industry.name.toLowerCase()}. Specific responsibilities vary by employer, location and level.`,
    responsibilities: [
      `Contribute to work related to ${specialization.name.toLowerCase()} in the ${industry.name.toLowerCase()} context.`,
      "Coordinate with colleagues, clients, users or community members connected to the work.",
      "Review outcomes, document decisions and follow relevant quality, safety or professional procedures.",
    ],
    skills,
    skillGroups: {
      core: skills.slice(0, 2),
      additional: skills.slice(2),
      transferable: ["Communication", "Collaboration", "Critical thinking"],
    },
    qualifications: [
      "Required qualifications and entry prerequisites have not been verified for this profession.",
      "Preferred education and experience vary by employer and location; check current role descriptions.",
      specialization.regulated
        ? "This field may have formal eligibility or practice rules. Confirm current requirements with the relevant official authority."
        : "Check with recognised institutions and employers before investing in a course or credential.",
    ],
    tools: [],
    stipend: null,
    salary: [],
    education: "Not verified. Review current official requirements and employer postings for the exact role and location.",
    roadmap: roadmapFor(record),
    projects: [
      `Create a short explainer about a question or process in ${specialization.name.toLowerCase()}.`,
      `Develop a small, clearly labelled learning project related to ${field.name.toLowerCase()} and describe your approach.`,
      "Compare two current job descriptions and note the requirements they share and the ones that differ.",
    ],
    growth: ["Build foundations", "Develop supervised or practical experience", "Explore specialist, adjacent or leadership directions"],
    related,
    sources: reviewedSources[slug] ?? [],
    verificationStatus: "needs-verification",
    confidence: "unassessed",
    applicability: "India — taxonomy entry only; profession-specific facts are not yet verified.",
    updated: taxonomyUpdated,
    marketContext: "No verified hiring, location, employer or demand data has been added for this profession.",
    workSettings: [],
    employmentTypes: [],
  };
});

export function careerBySlug(slug: string) {
  return careers.find((career) => career.slug === slug);
}

export const careerCount = careers.length;

export const verifiedSalaryCount = careers.filter((career) => career.salary.length > 0).length;
export const verifiedStipendCount = careers.filter((career) => career.stipend !== null).length;

export const taxonomySourceNote =
  "The profession list is a structured discovery taxonomy, not an independently verified occupational database. Source records, qualification routes, employment details, salary and internship figures are pending verification.";
