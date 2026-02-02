import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { NaviProvider } from '@/hooks/useNaviStore'
import { useTheme } from '@/hooks/useTheme'
import { Layout } from '@/components/Layout'
import { useLocalStorage } from '@/hooks/useLocalStorage'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

function App() {
  const { resolvedTheme } = useTheme()
  const [viewMode] = useLocalStorage<'card' | 'list'>('navi_view_mode', 'card')
  const [collapsedGroups] = useLocalStorage<string[]>('navi_collapsed_groups', [])
  const [sidebarCollapsed] = useLocalStorage<boolean>('navi_sidebar_collapsed', false)

  return (
    <BrowserRouter basename={basename}>
      <NaviProvider
        initialViewMode={viewMode}
        initialCollapsedGroups={collapsedGroups}
        initialSidebarCollapsed={sidebarCollapsed}
      >
        <div className={resolvedTheme}>
          <Routes>
            <Route path="/" element={<Layout />} />
            <Route path="/category/:slug" element={<Layout />} />
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center h-screen">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-muted-foreground mb-8">頁面不存在</p>
                    <Link to="/" className="text-primary hover:underline">
                      返回首頁
                    </Link>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </NaviProvider>
    </BrowserRouter>
  )
}

export default App
