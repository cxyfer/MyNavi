import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from '@/contexts/ConfigContext'
import { loadConfig } from '@/lib/configLoader'
import './index.css'
import App from './App.tsx'

async function main() {
  const config = await loadConfig()
  document.title = config.description
    ? `${config.title} - ${config.description}`
    : config.title

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ConfigProvider config={config}>
        <App />
      </ConfigProvider>
    </StrictMode>,
  )
}

main()
