import { create } from 'zustand'
import { useLayoutEffect } from 'react'

import type { ServerProps } from '../types'

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

export const initRouterStore = (props?: ServerProps): void => {
  const updateLocation = useRouterStore((st) => st.updateLocation)

  // Init the store in the server in order to correctly
  // SSR the components that depend on the router.
  if (typeof window === 'undefined') {
    updateLocation({
      pathname: props?.router.pathname || '',
      hash: '',
      href: '',
      searchStr: '',
    })
  }

  // Update the store on the client side before the first
  // rendering
  useLayoutEffect(() => {
    const { pathname, hash, href, search } = window.location
    updateLocation({
      pathname,
      hash,
      href,
      searchStr: search,
      search: new URLSearchParams(search),
    })
  }, [])
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
