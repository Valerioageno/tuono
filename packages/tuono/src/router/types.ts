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
