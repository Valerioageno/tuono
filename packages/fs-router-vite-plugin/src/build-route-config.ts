import { spaces } from './utils'
import type { RouteNode } from './types'

export function buildRouteConfig(nodes: RouteNode[], depth = 1): string {
  const children = nodes.map((node) => {
    const route = `${node.variableName}Route`

    if (node.children?.length) {
      const childConfigs = buildRouteConfig(node.children, depth + 1)
      return `${route}.addChildren([${spaces(depth * 4)}${childConfigs}])`
    }

    return route
  })

  return children.filter(Boolean).join(`,`)
}
