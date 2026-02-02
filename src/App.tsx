import { NaviProvider } from '@/hooks/useNaviStore'
import { useTheme } from '@/hooks/useTheme'
import { NavigationContainer } from '@/components/NavigationContainer'
import { useLocalStorage } from '@/hooks/useLocalStorage'

function App() {
  const { theme, resolvedTheme, toggleTheme } = useTheme()
  const [viewMode] = useLocalStorage<'card' | 'list'>('navi_view_mode', 'card')
  const [collapsedGroups] = useLocalStorage<string[]>('navi_collapsed_groups', [])
  const [sidebarCollapsed] = useLocalStorage<boolean>('navi_sidebar_collapsed', false)

  return (
    <NaviProvider
      initialViewMode={viewMode}
      initialCollapsedGroups={collapsedGroups}
      initialSidebarCollapsed={sidebarCollapsed}
    >
      <div className={resolvedTheme}>
        <NavigationContainer theme={theme} onThemeToggle={toggleTheme} />
      </div>
    </NaviProvider>
  )
}

export default App
