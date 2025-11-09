import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle({ fixed = true }) {
  const { isDark, toggleTheme } = useTheme()

  const positionClass = fixed 
    ? "fixed top-4 right-4 z-50" 
    : "relative"

  return (
    <button
      onClick={toggleTheme}
      className={`${positionClass} p-3 rounded-full bg-white dark:bg-primary-light shadow-card hover:shadow-hover transition-brand hover:scale-110 border-2 border-neutral-medium dark:border-accent/30`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-accent-light" />
      ) : (
        <Moon className="w-5 h-5 text-accent" />
      )}
    </button>
  )
}
