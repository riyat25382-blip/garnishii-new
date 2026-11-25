import { careerTaxonomy } from "./career-taxonomy";

export type Industry = {
  slug: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  fieldCount: number;
};

export const industries: Industry[] = careerTaxonomy.map(({ fields, ...industry }) => ({
  ...industry,
  fieldCount: fields.length,
}));
