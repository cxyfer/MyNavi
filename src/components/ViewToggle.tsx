import { LayoutGrid, List } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

interface ViewToggleProps {
  value: 'card' | 'list'
  onChange: (value: 'card' | 'list') => void
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as 'card' | 'list')}
      role="radiogroup"
      aria-label="檢視模式"
    >
      <ToggleGroupItem value="card" aria-label="卡片模式" className="data-[state=off]:opacity-50">
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="列表模式" className="data-[state=off]:opacity-50">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
