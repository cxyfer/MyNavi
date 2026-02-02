import { useState, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  debounceMs?: number
  placeholder?: string
  onFocusChange?: (focused: boolean) => void
}

export function SearchBar({
  value,
  onChange,
  debounceMs = 300,
  placeholder = '搜尋連結...',
  onFocusChange,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(inputValue)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [inputValue, debounceMs, onChange])

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleClear = useCallback(() => {
    setInputValue('')
    onChange('')
  }, [onChange])

  return (
    <div
      className="relative flex-1 h-9"
      onFocus={() => onFocusChange?.(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          onFocusChange?.(false)
        }
      }}
    >
      <Search className="absolute left-3 top-[13px] h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
        aria-label="搜尋"
      />
      {inputValue && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          onClick={handleClear}
          aria-label="清除搜尋"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
