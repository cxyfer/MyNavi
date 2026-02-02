import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type ReactNode,
} from 'react'

interface NaviState {
  searchQuery: string
  selectedTags: Set<string>
  viewMode: 'card' | 'list'
  collapsedGroups: Set<string>
  sidebarCollapsed: boolean
}

type NaviAction =
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'TOGGLE_TAG'; payload: string }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_VIEW_MODE'; payload: 'card' | 'list' }
  | { type: 'TOGGLE_GROUP'; payload: string }
  | { type: 'SET_COLLAPSED_GROUPS'; payload: Set<string> }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_COLLAPSED'; payload: boolean }

interface NaviContextValue extends NaviState {
  setSearchQuery: (query: string) => void
  toggleTag: (tag: string) => void
  clearFilters: () => void
  setViewMode: (mode: 'card' | 'list') => void
  toggleGroup: (group: string) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

const NaviContext = createContext<NaviContextValue | null>(null)

function naviReducer(state: NaviState, action: NaviAction): NaviState {
  switch (action.type) {
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }

    case 'TOGGLE_TAG': {
      const newTags = new Set(state.selectedTags)
      if (newTags.has(action.payload)) {
        newTags.delete(action.payload)
      } else {
        newTags.add(action.payload)
      }
      return { ...state, selectedTags: newTags }
    }

    case 'CLEAR_FILTERS':
      return { ...state, searchQuery: '', selectedTags: new Set() }

    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload }

       case 'TOGGLE_GROUP': {
      const newCollapsed = new Set(state.collapsedGroups)
      if (newCollapsed.has(action.payload)) {
        newCollapsed.delete(action.payload)
      } else {
        newCollapsed.add(action.payload)
      }
      return { ...state, collapsedGroups: newCollapsed }
    }

    case 'SET_COLLAPSED_GROUPS':
      return { ...state, collapsedGroups: action.payload }

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed }

    case 'SET_SIDEBAR_COLLAPSED':
      return { ...state, sidebarCollapsed: action.payload }

    default:
      return state
  }
}

const initialState: NaviState = {
  searchQuery: '',
  selectedTags: new Set(),
  viewMode: 'card',
  collapsedGroups: new Set(),
  sidebarCollapsed: false,
}

interface NaviProviderProps {
  children: ReactNode
  initialViewMode?: 'card' | 'list'
  initialCollapsedGroups?: string[]
  initialSidebarCollapsed?: boolean
}

export function NaviProvider({
  children,
  initialViewMode,
  initialCollapsedGroups,
  initialSidebarCollapsed,
}: NaviProviderProps) {
  const [state, dispatch] = useReducer(naviReducer, {
    ...initialState,
    viewMode: initialViewMode ?? initialState.viewMode,
    collapsedGroups: new Set(initialCollapsedGroups ?? []),
    sidebarCollapsed: initialSidebarCollapsed ?? initialState.sidebarCollapsed,
  })

  const value = useMemo<NaviContextValue>(
    () => ({
      ...state,
      setSearchQuery: (query) =>
        dispatch({ type: 'SET_SEARCH_QUERY', payload: query }),
      toggleTag: (tag) => dispatch({ type: 'TOGGLE_TAG', payload: tag }),
      clearFilters: () => dispatch({ type: 'CLEAR_FILTERS' }),
      setViewMode: (mode) =>
        dispatch({ type: 'SET_VIEW_MODE', payload: mode }),
      toggleGroup: (group) =>
        dispatch({ type: 'TOGGLE_GROUP', payload: group }),
      toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
      setSidebarCollapsed: (collapsed) =>
        dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: collapsed }),
    }),
    [state]
  )

  return <NaviContext.Provider value={value}>{children}</NaviContext.Provider>
}

export function useNaviStore(): NaviContextValue {
  const context = useContext(NaviContext)
  if (!context) {
    throw new Error('useNaviStore must be used within NaviProvider')
  }
  return context
}
