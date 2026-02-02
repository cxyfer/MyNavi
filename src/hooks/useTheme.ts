import { useEffect, useState, useCallback } from 'react'

export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'navi_theme'

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored
    }
  } catch {
    // Silent fail
  }
  return 'system'
}

export function useTheme(): {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
} {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const stored = getStoredTheme()
    setThemeState(stored)
    setResolvedTheme(stored === 'system' ? getSystemTheme() : stored)
    setIsHydrated(true)

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (stored === 'system') {
        setResolvedTheme(media.matches ? 'dark' : 'light')
      }
    }
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (!isHydrated) return

    const resolved = theme === 'system' ? getSystemTheme() : theme
    setResolvedTheme(resolved)

    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(resolved)

    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Silent fail
    }
  }, [theme, isHydrated])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const order: Theme[] = ['light', 'dark', 'system']
      const idx = order.indexOf(prev)
      return order[(idx + 1) % order.length]
    })
  }, [])

  return {
    theme: isHydrated ? theme : 'system',
    resolvedTheme,
    setTheme,
    toggleTheme,
  }
}
