import { ChevronDown, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface GroupHeaderProps {
  group: string
  itemCount: number
  isCollapsed: boolean
  onToggle: () => void
}

export function GroupHeader({
  group,
  itemCount,
  isCollapsed,
  onToggle,
}: GroupHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted transition-colors"
      aria-expanded={!isCollapsed}
    >
      <div className="flex items-center gap-2">
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
        <h2 className="font-semibold">{group}</h2>
      </div>
      <Badge variant="secondary" className="text-xs">
        {itemCount}
      </Badge>
    </button>
  )
}
