import { useRouterStore } from './useRouterStore'

interface UseRouterHook {
  /**
   * Redirects to the path passed as argument updating the browser history.
   */
  push: (path: string) => void

  /**
   * This object contains all the query params of the current route
   */
  query: Record<string, any>

  /**
   * Returns the current pathname
   */
  pathname: string
}

export const useRouter = (): UseRouterHook => {
  const [location, updateLocation] = useRouterStore((st) => [
    st.location,
    st.updateLocation,
  ])

  const push = (path: string): void => {
    const url = new URL(path, window.location.origin)

    updateLocation({
      href: url.href,
      pathname: url.pathname,
      search: Object.fromEntries(url.searchParams),
      searchStr: url.search,
      hash: url.hash,
    })
    history.pushState(path, '', path)
  }

  return {
    push,
    query: location.search,
    pathname: location.pathname,
  }
}
