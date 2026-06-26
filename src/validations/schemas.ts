/* eslint-disable @typescript-eslint/no-explicit-any */
// src/validations/schemas.ts
import { z } from "zod";

// --- Utilitaires ---
const stringMinMax = (min: number, max: number, name: string) =>
  z
    .string()
    .min(min, `Le champ "${name}" doit contenir au moins ${min} caractères.`)
    .max(max, `Le champ "${name}" est trop long (max ${max} caractères).`);

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const dateSchema = z
  .string()
  .regex(dateRegex, "Le format de la date doit être YYYY-MM-DD")
  .optional()
  .or(z.literal("")); // Permet de vider le champ

// --- Schémas par Entité ---
export const conceptSchema = z.object({
  nom: stringMinMax(2, 100, "Nom"),
  enonce: stringMinMax(5, 10000, "Énoncé"),
  demonstration: stringMinMax(5, 20000, "Démonstration"),
});

export const mathematicienSchema = z.object({
  nom: stringMinMax(2, 100, "Nom"),
  biographie: stringMinMax(10, 10000, "Biographie"),
  nationalite: z
    .string()
    .max(50, "Nationalité trop longue")
    .optional()
    .or(z.literal("")),
  domaine: z
    .string()
    .max(100, "Domaine trop long")
    .optional()
    .or(z.literal("")),
  url: z
    .string()
    .url("L'URL doit être valide (ex: https://...)")
    .optional()
    .or(z.literal("")),
  date_naissance: dateSchema,
  date_deces: dateSchema,
  recompenses: z
    .string()
    .max(200, "Texte trop long")
    .optional()
    .or(z.literal("")),
  epoque: z.string().max(50, "Époque trop longue").optional().or(z.literal("")),
});

export const categorySchema = z.object({
  nom: stringMinMax(2, 100, "Nom"),
  description: stringMinMax(5, 5000, "Description"),
});

export const typeSchema = z.object({
  type: stringMinMax(2, 50, "Type"),
});

const schemas = {
  concept: conceptSchema,
  mathematicien: mathematicienSchema,
  category: categorySchema,
  type: typeSchema,
};

export const validateField = (
  entity: keyof typeof schemas,
  field: string,
  value: unknown,
) => {
  const entitySchema = schemas[entity] as z.ZodObject<any>;

  if (!(field in entitySchema.shape)) {
    return { success: true };
  }

  const fieldSchema = entitySchema.shape[field];

  const result = fieldSchema.safeParse(value);

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }
  return { success: true };
};
