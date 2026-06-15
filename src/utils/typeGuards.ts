import { AllNodeData } from "../types/types";
import { Mathematicien } from "../types/ApiTypes/mathematicien";
import { Category } from "../types/ApiTypes/category";

export const isAllNodeData = (data: unknown): data is AllNodeData => {
  return !!data && typeof data === "object" && "relations" in data;
};

export const isMathematicien = (data: unknown): data is Mathematicien => {
  return !!data && typeof data === "object" && "nationalite" in data;
};

export const isCategory = (data: unknown): data is Category => {
  return !!data && typeof data === "object" && "parent_id" in data;
};
