import { useState, useEffect, useRef } from 'react'
import type { Route } from '../route'
import { useRouterStore } from './useRouterStore'
import { fromUrlToParsedLocation } from '../utils/from-url-to-parsed-location'

const isServer = typeof document === 'undefined'

interface UseServerSidePropsReturn {
  data: any
  isLoading: boolean
}

declare global {
  interface Window {
    __TUONO_SSR_PROPS__: any
  }
}

interface TuonoApi {
  data?: any
  info: {
    redirect_destination?: string
  }
}

const fetchClientSideData = async (): Promise<TuonoApi> => {
  const slash = location.pathname.endsWith('/') ? '' : '/'
  const res = await fetch(`/__tuono/data${location.pathname}${slash}data.json`)
  const data: TuonoApi = await res.json()
  return data
}

/*
 * Use the props provided by the SSR and dehydrate the
 * props for client side usage.
 *
 * In case is a client fetch the remote data API
 */
export function useServerSideProps<T>(
  route: Route,
  // User defined props
  serverSideProps: T,
): UseServerSidePropsReturn {
  const isFirstRendering = useRef<boolean>(true)
  const [location, updateLocation] = useRouterStore((st) => [
    st.location,
    st.updateLocation,
  ])
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
    if (route.options.hasHandler) {
      ;(async (): Promise<void> => {
        setIsLoading(true)
        try {
          const response = await fetchClientSideData()
          if (response.info.redirect_destination) {
            const parsedLocation = fromUrlToParsedLocation(
              response.info.redirect_destination,
            )

            history.pushState(
              parsedLocation.pathname,
              '',
              parsedLocation.pathname,
            )

            updateLocation(parsedLocation)
            return
          }
          setData(response.data)
        } catch (error) {
          throw Error('Failed loading Server Side Data', { cause: error })
        } finally {
          setIsLoading(false)
        }
      })()
    }

    // Clean up the data when changing route
    return (): void => {
      setData(undefined)
    }
  }, [location.pathname])

  return { isLoading, data }
}
