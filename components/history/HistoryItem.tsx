import { format } from 'date-fns'
import { Card } from '@/components/ui/Card'
import { getCategoryColorClasses } from '@/lib/categoryColors'

interface HistoryItemProps {
  category: string
  task?: string | null
  note?: string | null
  date: Date
  isRepeated?: boolean
}

export function HistoryItem({
  category,
  task,
  note,
  date,
  isRepeated,
}: HistoryItemProps) {

    console.log('RAW DATE: ', date, date instanceof Date)
  const { bg, text } = getCategoryColorClasses(category)

  return (
    <Card className="flex items-start gap-4">
      <div className={`h-10 w-10 rounded-full flex-shrink-0 ${bg}`} />

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className={`font-medium ${text}`}>
            {category}
          </p>
          <p className="text-sm text-zinc-400">
            {format(date, 'h:mm a')}
          </p>
        </div>

        {task && (
          <p className="text-sm text-zinc-600 mt-1">
            {task}
          </p>
        )}

        {note && (
          <p className="text-sm text-zinc-500 italic mt-1">
            “{note}”
          </p>
        )}

        {isRepeated && (
          <p className="text-xs text-zinc-400 italic mt-1">
            You’ve logged this excuse before.
          </p>
        )}
      </div>
    </Card>
  )
}