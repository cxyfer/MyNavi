import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(defaultValue)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        setValue(JSON.parse(stored))
      }
    } catch {
      // Silent fail - use default
    }
    setIsHydrated(true)
  }, [key])

  const setStoredValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof newValue === 'function'
            ? (newValue as (prev: T) => T)(prev)
            : newValue

        try {
          localStorage.setItem(key, JSON.stringify(resolved))
        } catch {
          // Silent fail - localStorage may be unavailable
        }

        return resolved
      })
    },
    [key]
  )

  return [isHydrated ? value : defaultValue, setStoredValue]
}
