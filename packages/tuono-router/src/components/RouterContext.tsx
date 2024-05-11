import * as React from 'react'
import type { Router } from '../router'

const routerContext = React.createContext<Router>(null!)

const ROUTER_DOM_CONTEXT = '__TUONO_ROUTER__CONTEXT__'

export function getRouterContext(): any {
  if (typeof document === 'undefined') {
    return routerContext
  }

  if (window[ROUTER_DOM_CONTEXT as any]) {
    return window[ROUTER_DOM_CONTEXT as any]
  }

  window[ROUTER_DOM_CONTEXT as any] = routerContext as any

  return routerContext
}
