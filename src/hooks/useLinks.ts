import { useState, useEffect, useCallback } from 'react'
import type { LinkItem, LinkGroup } from '@/types/link'

interface UseLinksReturn {
  data: LinkGroup[]
  items: LinkItem[]
  loading: boolean
  error: Error | null
  refetch: () => void
}

export function useLinks(): UseLinksReturn {
  const [data, setData] = useState<LinkGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${import.meta.env.BASE_URL}data/links.json`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()

      if (!json.groups || !Array.isArray(json.groups)) {
        throw new Error('Invalid data format: expected "groups" array')
      }

      setData(json.groups)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      console.error('[useLinks] Failed to fetch links:', error)
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData, retryCount])

  const refetch = useCallback(() => {
    setRetryCount(c => c + 1)
  }, [])

  const items = data.flatMap(group => group.items)

  return { data, items, loading, error, refetch }
}
