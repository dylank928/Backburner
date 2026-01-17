import { Card } from './Card'

interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4">
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
          {icon}
        </div>
      )}

      <div>
        <p className="text-sm text-zinc-500">{label}</p>
        <p className="text-xl font-semibold text-zinc-900">{value}</p>
      </div>
    </Card>
  )
}
