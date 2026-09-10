import { GED_CATEGORIES } from "./gedCategories";
import { TRAINING_CATEGORIES } from "@/components/training/constants/trainingCategories";

export function getCategories(
  mode: "ged" | "training" = "ged"
){

  return mode === "training"
    ? TRAINING_CATEGORIES
    : GED_CATEGORIES;

}
