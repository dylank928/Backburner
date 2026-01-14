/**
 * Generates a consistent color for an excuse category
 * Uses a hash function to ensure the same category always gets the same color
 */

// Neutral color palette - muted, calm tones
const categoryColors = [
  // Grays
  { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-300' },
  { bg: 'bg-gray-200 dark:bg-gray-600', text: 'text-gray-800 dark:text-gray-200' },
  // Blues
  { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
  { bg: 'bg-blue-200 dark:bg-blue-800/30', text: 'text-blue-800 dark:text-blue-200' },
  // Purples
  { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
  { bg: 'bg-purple-200 dark:bg-purple-800/30', text: 'text-purple-800 dark:text-purple-200' },
  // Teals
  { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-300' },
  { bg: 'bg-teal-200 dark:bg-teal-800/30', text: 'text-teal-800 dark:text-teal-200' },
  // Indigos
  { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300' },
  { bg: 'bg-indigo-200 dark:bg-indigo-800/30', text: 'text-indigo-800 dark:text-indigo-200' },
  // Slates
  { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-700 dark:text-slate-300' },
  { bg: 'bg-slate-200 dark:bg-slate-600', text: 'text-slate-800 dark:text-slate-200' },
]

/**
 * Simple hash function to convert string to number
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

/**
 * Get consistent color classes for a category name
 * @param categoryName The name of the excuse category
 * @returns Object with bg and text Tailwind classes
 */
export function getCategoryColor(categoryName: string): { bg: string; text: string } {
  const hash = hashString(categoryName.toLowerCase())
  const index = hash % categoryColors.length
  return categoryColors[index]
}
