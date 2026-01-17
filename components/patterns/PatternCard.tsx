interface PatternCardProps {
  label: string
  value: string
  description: string
  tone?: 'warm' | 'neutral' | 'cool'
}

const toneStyles = {
  warm: 'from-orange-50 to-orange-100',
  neutral: 'from-rose-50 to-rose-100',
  cool: 'from-indigo-50 to-indigo-100',
}

export function PatternCard({
  label,
  value,
  description,
  tone = 'neutral',
}: PatternCardProps) {
  return (
    <div className={`rounded-xl p-5 bg-gradient-to-br ${toneStyles[tone]}`}>
      <p className="text-xs font-medium text-zinc-500 uppercase mb-1">
        {label}
      </p>

      <p className="text-xl font-semibold text-zinc-900">
        {value}
      </p>

      <p className="text-sm text-zinc-600 mt-1">
        {description}
      </p>
    </div>
  )
}
