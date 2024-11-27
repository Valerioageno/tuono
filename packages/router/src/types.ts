import type { ComponentType as ReactComponentType } from 'react'

export interface Segment {
  type: 'pathname' | 'param' | 'wildcard'
  value: string
}

export interface ServerProps<TProps = unknown> {
  router: {
    href: string
    pathname: string
    searchStr: string
  }
  props: TProps
}

export interface RouteProps<TData = unknown> {
  data: TData
  isLoading: boolean
}

export type RouteComponent = ReactComponentType<RouteProps> & {
  preload: () => void
}
