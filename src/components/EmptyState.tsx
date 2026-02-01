import { SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onClear: () => void
}

export function EmptyState({ onClear }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <SearchX className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">沒有找到結果</h3>
      <p className="text-sm text-muted-foreground mb-4">
        嘗試調整搜尋條件或標籤篩選
      </p>
      <Button onClick={onClear} variant="outline">
        清除篩選
      </Button>
    </div>
  )
}
