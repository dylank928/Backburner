'use client'

interface PatternCardProps {
  label: string;
  value: string;
  description?: string;
}

export function PatternCard({ label, value, description }: PatternCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 p-4 bg-white">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-zinc-900">{value}</p>
      {description && (
        <p className="text-sm text-zinc-500 mt-1">{description}</p>
      )}
    </div>
  );
}
