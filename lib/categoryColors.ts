export type CategoryColor = {
  bg: string
  text: string
  ring: string
}

export const CATEGORY_COLORS: Record<string, CategoryColor> = {
  // Core / common
  Tired: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    ring: 'ring-orange-200',
  },
  Distracted: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    ring: 'ring-blue-200',
  },
  'Low motivation': {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    ring: 'ring-amber-200',
  },

  // Planning / structure
  'Poor planning': {
    bg: 'bg-violet-100',
    text: 'text-violet-800',
    ring: 'ring-violet-200',
  },
  'Too ambitious': {
    bg: 'bg-fuchsia-100',
    text: 'text-fuchsia-800',
    ring: 'ring-fuchsia-200',
  },

  // External
  'External obligation': {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    ring: 'ring-emerald-200',
  },

  // Neutral
  Forget: {
    bg: 'bg-zinc-100',
    text: 'text-zinc-700',
    ring: 'ring-zinc-200',
  },
  Other: {
    bg: 'bg-zinc-100',
    text: 'text-zinc-700',
    ring: 'ring-zinc-200',
  },
}
// Chart-safe colors (SVG / Recharts)
export const CATEGORY_COLOR_HEX: Record<string, string> = {
  Tired: '#FDBA74',                // orange-300
  Distracted: '#93C5FD',           // blue-300
  'Low motivation': '#FCD34D',     // amber-300
  'Poor planning': '#C4B5FD',      // violet-300
  'Too ambitious': '#F0ABFC',      // fuchsia-300
  'External obligation': '#6EE7B7',// emerald-300
  Forget: '#D4D4D8',               // zinc-300
  Other: '#D4D4D8',
}

export function getCategoryColorHex(category: string): string {
  return CATEGORY_COLOR_HEX[category] ?? '#D4D4D8'
}

export function getCategoryColorClasses(category: string): CategoryColor {
  return (
    CATEGORY_COLORS[category] ?? {
      bg: 'bg-zinc-100',
      text: 'text-zinc-700',
      ring: 'ring-zinc-200',
    }
  )
}
