interface ExcuseTagProps {
  category: string
  count?: number
  showRepeated?: boolean
}

const categoryColors: Record<string, string> = {
  'Tired': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  'Distracted': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
  'Poor planning': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
  'Too ambitious': 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300',
  'Forgot': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
  'Low motivation': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300',
  'External obligation': 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300',
  'Other': 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300',
}

export default function ExcuseTag({ category, count, showRepeated }: ExcuseTagProps) {
  const colorClass = categoryColors[category] || categoryColors['Other']
  
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {category}
      {count !== undefined && count > 1 && (
        <span className="ml-1 opacity-75">({count})</span>
      )}
      {showRepeated && (
        <span className="ml-1 text-xs opacity-60 italic">(repeated)</span>
      )}
    </span>
  )
}
