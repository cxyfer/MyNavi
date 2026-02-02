import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Wrench,
  BookOpen,
  Package,
  Cloud,
  ChevronLeft,
  ChevronRight,
  X,
  Home,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LinkGroup } from '@/types/link'
import { useAppConfig } from '@/hooks/useAppConfig'

interface SidebarProps {
  groups: LinkGroup[]
  currentSlug?: string
  isCollapsed: boolean
  onToggleCollapse: () => void
  isMobileOpen: boolean
  onMobileClose: () => void
}

const ICON_MAP: Record<string, LucideIcon> = {
  wrench: Wrench,
  'book-open': BookOpen,
  package: Package,
  cloud: Cloud,
}

export function Sidebar({
  groups,
  currentSlug,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onMobileClose,
}: SidebarProps) {
  const config = useAppConfig()

  const iconMap = useMemo(() => {
    const map: Record<string, LucideIcon> = {}
    groups.forEach((g) => {
      if (g.icon && ICON_MAP[g.icon]) {
        map[g.icon] = ICON_MAP[g.icon]
      }
    })
    return map
  }, [groups])

  const NavItems = () => (
    <nav className="flex-1 space-y-1 p-2">
      <Link
        to="/"
        onClick={() => isMobileOpen && onMobileClose()}
        className={cn(
          'flex items-center rounded-md py-2 text-sm font-medium transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          !currentSlug && 'bg-accent text-accent-foreground',
          isCollapsed ? 'justify-center px-2' : 'px-3'
        )}
        title={isCollapsed ? '首頁' : undefined}
      >
        <Home className="h-5 w-5 shrink-0" />
        <span
          className={cn(
            'overflow-hidden transition-all duration-300 whitespace-nowrap',
            isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 ml-3'
          )}
        >
          首頁
        </span>
      </Link>
      {groups.map((group) => {
        const Icon = group.icon ? iconMap[group.icon] : Package
        const isActive = currentSlug === group.slug

        return (
          <Link
            key={group.slug}
            to={`/category/${group.slug}`}
            onClick={() => isMobileOpen && onMobileClose()}
            className={cn(
              'flex items-center rounded-md py-2 text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              isActive && 'bg-accent text-accent-foreground',
              isCollapsed ? 'justify-center px-2' : 'px-3'
            )}
            title={isCollapsed ? group.name : undefined}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span
              className={cn(
                'overflow-hidden transition-all duration-300 whitespace-nowrap',
                isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 ml-3'
              )}
            >
              {group.name}
            </span>
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      <aside
        className={cn(
          'hidden md:flex flex-col fixed left-0 top-0 h-screen border-r bg-background',
          'transition-all duration-300 ease-in-out z-30',
          isCollapsed ? 'w-12' : 'w-60'
        )}
      >
        <div
          className={cn(
            'flex h-14 items-center border-b transition-all duration-300',
            isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
          )}
        >
          <span
            className={cn(
              'font-semibold overflow-hidden transition-all duration-300 whitespace-nowrap',
              isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
            )}
          >
            {config.title}
          </span>
          <button
            onClick={onToggleCollapse}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent shrink-0"
            aria-label={isCollapsed ? '展開側邊欄' : '收起側邊欄'}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
        <NavItems />
      </aside>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-60 bg-background border-r z-50 md:hidden',
          'transition-transform duration-300 ease-in-out',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <span className="font-semibold">{config.title}</span>
          <button
            onClick={onMobileClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
            aria-label="關閉選單"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <NavItems />
      </aside>
    </>
  )
}
