import type { ComponentType as ReactComponentType } from 'react'

export interface Segment {
  type: 'pathname' | 'param' | 'wildcard'
  value: string
}

export interface ServerProps {
  router: {
    href: string
    pathname: string
    searchStr: string
  }
  props: any
}

export interface RouteProps {
  data: any
  isLoading: boolean
}

export type RouteComponent = ReactComponentType<RouteProps> & {
  preload: () => void
}
