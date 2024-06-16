import type { RouterType } from './router'
import { trimPathLeft, joinPaths } from './utils'

interface RouteOptions {
  isRoot?: boolean
  getParentRoute?: () => Route
  path?: string
  component: () => JSX.Element
}

export function createRoute(options: RouteOptions): Route {
  return new Route(options)
}

export const rootRouteId = '__root__'

export class Route {
  parentRoute!: any
  id: number
  fullPath!: string
  path: string
  options: any

  children?: Route[]
  router: RouterType
  isRoot: boolean
  originalIndex: number
  component: () => JSX.Element

  constructor(options: RouteOptions) {
    this.isRoot = options.isRoot ?? typeof options.getParentRoute !== 'function'
    this.options = options
    ;(this as any).$$typeof = Symbol.for('react.memo')

    this.component = options.component
  }

  init = (originalIndex: number): void => {
    this.originalIndex = originalIndex

    const isRoot = !this.options?.path && !this.options?.id

    this.parentRoute = this.options?.getParentRoute?.()

    if (isRoot) {
      this.path = rootRouteId
    }

    let path: undefined | string = isRoot ? rootRouteId : this.options.path

    // If the path is anything other than an index path, trim it up
    if (path && path !== '/') {
      path = trimPathLeft(path)
    }

    const customId = this.options?.id || path

    // Strip the parentId prefix from the first level of children
    let id = isRoot
      ? rootRouteId
      : joinPaths([
          this.parentRoute.id === rootRouteId ? '' : this.parentRoute.id,
          customId,
        ])

    if (path === rootRouteId) {
      path = '/'
    }

    if (id !== rootRouteId) {
      id = joinPaths(['/', id])
    }

    const fullPath =
      id === rootRouteId ? '/' : joinPaths([this.parentRoute.fullPath, path])

    this.path = path
    this.id = id
    this.fullPath = fullPath
    this.to = fullPath
  }

  addChildren(routes: Route[]): Route {
    this.children = routes
    return this
  }

  update = (options: RouteOptions): this => {
    Object.assign(this.options, options)
    this.isRoot = options.isRoot || !options.getParentRoute
    return this
  }
}

export function createRootRoute(options?: RouteOptions): Route {
  return new Route({ ...options, isRoot: true })
}
