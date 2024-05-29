import { useState, useEffect, useRef } from 'react'
import type { Route } from '../route'

const isServer = typeof document === 'undefined'

interface UseServerSidePropsReturn {
  data: any
  isLoading: boolean
}

/*
 * Use the props provided by the SSR and dehydrate the
 * props for client side usage.
 *
 * In case is a client fetch the remote data API
 */
export function useServerSideProps(
  route: Route,
  // User defined props
  serverSideProps: any,
): UseServerSidePropsReturn {
  const isFirstRendering = useRef<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(
    // Force loading if has handler
    route.options.hasHandler &&
      // Avoid loading on the server
      !isServer &&
      // Avoid loading if first rendering
      !isFirstRendering.current,
  )

  const [data, setData] = useState<any>(
    serverSideProps ?? window.__TUONO_SSR_PROPS__?.props,
  )

  useEffect(() => {
    // First loading just dehydrate since the
    // props are already bundled by the SSR
    if (isFirstRendering.current) {
      isFirstRendering.current = false
      return
    }
    // After client side routing load again the remote data
    if (route.options.hasHandler && !data) {
      ;(async (): Promise<void> => {
        setIsLoading(true)
        try {
          const res = await fetch(`/__tuono/data/${route.path}`)
          setData(await res.json())
        } catch (error) {
          // Handle here error
        } finally {
          setIsLoading(false)
        }
      })()
    }

    // Clean up the data when changing route
    return (): void => {
      setData(undefined)
    }
  }, [route.path])

  return { isLoading, data }
}