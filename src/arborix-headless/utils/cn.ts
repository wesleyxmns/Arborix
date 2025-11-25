import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================================================
// Classnames Utility
// Copied from v1.x - EXACT SAME LOGIC
// ============================================================================

/**
 * Merge Tailwind CSS classes with clsx
 * Handles conflicts and deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
