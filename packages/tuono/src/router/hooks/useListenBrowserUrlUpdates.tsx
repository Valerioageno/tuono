import { useRouterStore } from './useRouterStore.tsx'
import { useEffect } from 'react'

/*
 * This hook is meant to handle just browser related location updates
 * like the back and forward buttons.
 */
export const useListenBrowserUrlUpdates = (): void => {
  const updateLocation = useRouterStore((st) => st.updateLocation)

  const updateLocationOnPopStateChange = ({ target }: any): void => {
    const { pathname, hash, href, search } = target.location
    updateLocation({
      pathname,
      hash,
      href,
      searchStr: search,
      search: new URLSearchParams(search),
    })
  }
  useEffect(() => {
    window.addEventListener('popstate', updateLocationOnPopStateChange)
    return (): void => {
      window.removeEventListener('popstate', updateLocationOnPopStateChange)
    }
  }, [])
}
