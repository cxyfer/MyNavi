import { useConfig } from '@/contexts/ConfigContext'
import type { AppConfig } from '@/types/config'

export type { AppConfig }

export function useAppConfig(): AppConfig {
  return useConfig()
}
