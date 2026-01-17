interface PrimaryButtonProps {
    children: React.ReactNode
    onClick?: () => void
    type?: 'button' | 'submit'
    className?: string
  }
  
  export function PrimaryButton({
    children,
    onClick,
    type = 'button',
    className = '',
  }: PrimaryButtonProps) {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`w-full rounded-full bg-gradient-to-r from-orange-400 to-red-500 py-4 text-white font-medium transition-opacity hover:opacity-90 ${className}`}
      >
        {children}
      </button>
    )
  }