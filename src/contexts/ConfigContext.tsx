import { createContext, useContext } from 'react'
import type { AppConfig } from '@/types/config'

interface ConfigContextValue {
  config: AppConfig
}

const ConfigContext = createContext<ConfigContextValue | null>(null)

export interface ConfigProviderProps {
  children: React.ReactNode
  config: AppConfig
}

export function ConfigProvider({ children, config }: ConfigProviderProps) {
  return (
    <ConfigContext.Provider value={{ config }}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const ctx = useContext(ConfigContext)
  if (!ctx) throw new Error('useConfig must be used within ConfigProvider')
  return ctx.config
}
