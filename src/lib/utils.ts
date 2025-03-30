
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class values into a single class string
 * Merges Tailwind classes properly using tailwind-merge
 * 
 * @param {...ClassValue[]} inputs - Class values to be combined
 * @returns {string} - Combined class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
