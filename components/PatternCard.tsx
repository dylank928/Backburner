interface PatternCardProps {
  title: string
  value: string
  description?: string
}

export default function PatternCard({ title, value, description }: PatternCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
        {title}
      </h3>
      <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {value}
      </p>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  )
}
