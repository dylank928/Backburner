import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-xl bg-white/90 p-4 shadow-[0_2px_10px_rgba(0,0,0,0.15)] ${className}`}
    >
      {children}
    </div>
  )
}
