export interface AppConfig {
  title: string
  description: string
}

export const DEFAULT_CONFIG: AppConfig = {
  title: 'MyNavi',
  description: 'Personal Navigation Dashboard',
} as const

export const CONFIG_TIMEOUT = 3000

export const CONFIG_URL = '/config.json'
