export interface Segment {
  type: 'pathname' | 'param' | 'wildcard'
  value: string
}
