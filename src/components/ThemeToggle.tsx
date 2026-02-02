import { Sun, Moon, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Theme } from '@/hooks/useTheme'

interface ThemeToggleProps {
  theme: Theme
  onToggle: () => void
}

const icons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
}

const labels: Record<Theme, string> = {
  light: '淺色模式',
  dark: '深色模式',
  system: '跟隨系統',
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const Icon = icons[theme]

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      aria-label={labels[theme]}
      title={labels[theme]}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}
