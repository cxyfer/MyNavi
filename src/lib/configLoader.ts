import { DEFAULT_CONFIG, CONFIG_TIMEOUT, CONFIG_URL, type AppConfig } from '@/types/config'

async function fetchWithTimeout(url: string, timeout: number): Promise<AppConfig> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } finally {
    clearTimeout(timeoutId)
  }
}

let cachedConfig: AppConfig | null = null

export async function loadConfig(): Promise<AppConfig> {
  if (cachedConfig) return cachedConfig

  try {
    const data = await fetchWithTimeout(CONFIG_URL, CONFIG_TIMEOUT)
    cachedConfig = { ...DEFAULT_CONFIG, ...data }
  } catch {
    cachedConfig = { ...DEFAULT_CONFIG }
  }

  return cachedConfig
}
