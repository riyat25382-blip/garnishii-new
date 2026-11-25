import type { Career } from "@/data/careers";

export type CareerFilters = {
  query: string;
  industry: string;
  field: string;
  education: string;
  salary: string;
  stipend: string;
  skill: string;
  sort: string;
};

function hasSalaryInRange(career: Career, range: string) {
  return career.salary.some((salary) => {
    const values = salary.range.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
    if (!values.length) return false;
    const low = values[0];
    const high = values[1] ?? low;
    if (range === "under-5") return high < 5;
    if (range === "5-10") return high >= 5 && low <= 10;
    if (range === "over-10") return low > 10;
    return true;
  });
}

export function filterCareers(careers: Career[], filters: CareerFilters) {
  const query = filters.query.trim().toLowerCase();
  const filtered = careers.filter((career) => {
    const searchable = [
      career.title,
      career.industry,
      career.field,
      career.specialization,
      career.description,
      ...career.skills,
    ].join(" ").toLowerCase();
    const matchesQuery = !query || searchable.includes(query);
    const matchesIndustry = !filters.industry || career.industry === filters.industry;
    const matchesField = !filters.field || career.field === filters.field;
    const matchesEducation = !filters.education ||
      (filters.education === "needs-verification" && career.verificationStatus === "needs-verification") ||
      (filters.education === "verified" && career.verificationStatus === "verified");
    const matchesSalary = !filters.salary || hasSalaryInRange(career, filters.salary);
    const matchesStipend = !filters.stipend || (filters.stipend === "verified" && career.stipend !== null);
    const matchesSkill = !filters.skill || career.skills.some((skill) => skill.toLowerCase() === filters.skill.toLowerCase());
    return matchesQuery && matchesIndustry && matchesField && matchesEducation && matchesSalary && matchesStipend && matchesSkill;
  });

  if (filters.sort === "title") return filtered.sort((a, b) => a.title.localeCompare(b.title));
  if (filters.sort === "industry") return filtered.sort((a, b) => a.industry.localeCompare(b.industry) || a.title.localeCompare(b.title));
  return filtered;
}
