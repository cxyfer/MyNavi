import { useState, useMemo, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { ControlBar } from './ControlBar'
import { ContentArea } from './ContentArea'
import { CommandPalette } from './CommandPalette'
import { useNaviStore } from '@/hooks/useNaviStore'
import { useLinks } from '@/hooks/useLinks'
import { useFuzzySearch } from '@/hooks/useFuzzySearch'
import { useTheme } from '@/hooks/useTheme'
import { filterItems, extractAllTags } from '@/lib/filter'
import type { LinkItem } from '@/types/link'
import { cn } from '@/lib/utils'

export function Layout() {
  const { sidebarCollapsed, toggleSidebar } = useNaviStore()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { slug } = useParams()
  const { data: groups, items, error, refetch } = useLinks()
  const { theme, toggleTheme } = useTheme()
  const {
    searchQuery,
    selectedTags,
    viewMode,
    collapsedGroups,
    setSearchQuery,
    toggleTag,
    clearFilters,
    setViewMode,
    toggleGroup,
  } = useNaviStore()

  const [commandOpen, setCommandOpen] = useState(false)

  const currentGroup = useMemo(
    () => groups.find(g => g.slug === slug),
    [groups, slug]
  )

  const categoryItems = useMemo(
    () => slug ? items.filter(item => item.group === currentGroup?.name) : items,
    [items, slug, currentGroup]
  )

  const searchResults = useFuzzySearch(categoryItems, searchQuery)

  const filteredItems = useMemo(
    () =>
      filterItems({
        items: categoryItems,
        searchQuery,
        selectedTags,
        collapsedGroups,
        searchResults,
      }),
    [categoryItems, searchQuery, selectedTags, collapsedGroups, searchResults]
  )

  const allTags = useMemo(() => extractAllTags(categoryItems), [categoryItems])

  const handleTagClick = useCallback(
    (tag: string) => {
      if (!selectedTags.has(tag)) {
        toggleTag(tag)
      }
    },
    [selectedTags, toggleTag]
  )

  const handleCommandSelect = useCallback((item: LinkItem) => {
    const url = item.url
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }, [])

  if (slug && !currentGroup) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-muted-foreground mb-8">找不到此分類</p>
          <Link to="/" className="text-primary hover:underline">
            返回首頁
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        groups={groups ?? []}
        currentSlug={slug}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />
      <main
        className={cn(
          'flex-1 flex flex-col transition-all duration-300',
          sidebarCollapsed ? 'md:ml-12' : 'md:ml-60'
        )}
      >
        <ControlBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          tags={allTags}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          theme={theme}
          onThemeToggle={toggleTheme}
          onMenuClick={() => setIsMobileOpen(true)}
        />
        <div className="flex-1 overflow-hidden">
          <ContentArea
            items={filteredItems}
            viewMode={viewMode}
            searchQuery={searchQuery}
            collapsedGroups={collapsedGroups}
            error={error}
            onToggleGroup={toggleGroup}
            onTagClick={handleTagClick}
            onClearFilters={clearFilters}
            onRetry={refetch}
          />
        </div>
        <CommandPalette
          items={items}
          isOpen={commandOpen}
          onOpenChange={setCommandOpen}
          onSelect={handleCommandSelect}
        />
      </main>
    </div>
  )
}
