import { create } from 'zustand'

export interface ParsedLocation {
  href: string
  pathname: string
  search?: URLSearchParams
  searchStr: string
  hash: string
}

interface RouterState {
  isLoading: boolean
  isTransitioning: boolean
  status: 'idle'
  location: ParsedLocation
  matches: string[]
  pendingMatches: string[]
  cachedMatches: string[]
  statusCode: 200
  updateLocation: (loc: ParsedLocation) => void
}

export const useRouterStore = create<RouterState>()((set) => ({
  isLoading: false,
  isTransitioning: false,
  status: 'idle',
  location: {
    href: '',
    pathname: '',
    search: undefined,
    searchStr: '',
    hash: '',
  },
  matches: [],
  pendingMatches: [],
  cachedMatches: [],
  statusCode: 200,
  updateLocation: (location: ParsedLocation): void => set({ location }),
}))
