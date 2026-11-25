# Garnishii

Garnishii is a responsive profession-discovery site built with Next.js, TypeScript and Tailwind CSS. Its local taxonomy groups professions as **industry → field → specialisation → profession**.

## Run locally

```bash
npm run dev
```

Open the local URL printed by Next.js (usually [http://localhost:3000](http://localhost:3000)).

## What is included

- Search and browse across 30 industries and 374 individual profession entries.
- Industry, field and specialisation pages, plus a distinct dynamic page for each profession.
- Skill, industry and field filters; profession sorting; salary and internship ranges remain unavailable until verified sources are added.
- Save and compare professions in browser local storage.
- Profession guides with responsibilities, skill prompts, qualification and learning guidance, projects, related roles and source-status metadata. Source references identify the specific topics they support; listing a reference does not mark the entire guide as verified.

## Data integrity

`data/career-taxonomy.ts` is the structured taxonomy source and `data/careers.ts` builds the profession records and guides. The taxonomy is a discovery map, not a verified occupational database. Current records are marked as needing verification; qualification requirements, employer information, salaries and internship stipends have not been independently verified. Salary and stipend figures are omitted rather than estimated. When sources are added, their checked date and coverage are shown separately from the taxonomy date.

## Checks

```bash
npm run lint
npm run build
```
