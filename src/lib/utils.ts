import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes safely, resolving conflicts.
 * Used by all our UI components to maintain pristine styling.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}