import { useRouterStore } from './useRouterStore'

interface UseRouterHook {
  /**
   * Redirects to the path passed as argument updating the browser history.
   */
  push: (path: string) => void
}

export const useRouter = (): UseRouterHook => {
  const push = (path: string): void => {
    const url = new URL(path, window.location.origin)

    useRouterStore.setState({
      location: {
        href: url.href,
        pathname: url.pathname,
        search: url.searchParams,
        searchStr: url.search,
        hash: url.hash,
      },
    })
    history.pushState(path, '', path)
  }

  return {
    push,
  }
}
