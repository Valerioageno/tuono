import type { ComponentType as ReactComponentType } from 'react'

import { trimPath, trimPathRight } from './utils'
import type { Route } from './route'

type RouteTree = any

interface CreateRouter {
  routeTree: RouteTree
  basePath?: string
  options?: RouteOptions
}

interface RouteOptions {
  component?: ReactComponentType
  hasHandler?: boolean
  routeTree?: RouteTree
}

export type RouterType = any

export function createRouter(options: CreateRouter): Router {
  return new Router(options)
}

export class Router {
  options?: RouteOptions
  basePath = '/'
  routeTree: any
  history: any
  isServer = typeof document === 'undefined'
  routesById: Record<string, Route> = {}
  // Not used
  routesByPath: Record<string, Route> = {}
  flatRoutes: any

  constructor(options: CreateRouter) {
    this.update({
      ...options,
    })

    if (!this.isServer) {
      ;(window as any).__TSR__ROUTER__ = this
    }
  }

  update = (newOptions: CreateRouter): void => {
    this.options = {
      ...this.options,
      ...newOptions,
    }

    this.#updateBasePath(newOptions.basePath)

    if (this.options.routeTree !== this.routeTree) {
      this.routeTree = this.options.routeTree
      this.#buildRouteTree()
    }
  }

  #buildRouteTree = (): void => {
    const recurseRoutes = (childRoutes: Route[]): void => {
      childRoutes.forEach((route: Route, i: number) => {
        route.init(i)

        this.routesById[route.id || ''] = route

        if (!route.isRoot && route.options.path) {
          const trimmedFullPath = trimPathRight(route.fullPath)
          if (
            !this.routesByPath[trimmedFullPath] ||
            route.fullPath.endsWith('/')
          ) {
            this.routesByPath[trimmedFullPath] = route
          }
        }

        const children = route.children
        if (children?.length) {
          recurseRoutes(children)
        }
      })
    }

    recurseRoutes([this.routeTree])
  }

  #updateBasePath = (basePath?: string): void => {
    if (!this.basePath || (basePath && basePath !== basePath)) {
      if (basePath === undefined || basePath === '' || basePath === '/') {
        this.basePath = '/'
      } else {
        this.basePath = `/${trimPath(basePath)}`
      }
    }
  }
}
