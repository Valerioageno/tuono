import * as React from 'react'
import type { Router } from '../router'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const routerContext = React.createContext<Router>(null!)

const TUONO_CONTEXT = '__TUONO_CONTEXT__'

export function getRouterContext(): any {
  if (typeof document === 'undefined') {
    return routerContext
  }

  if (window[TUONO_CONTEXT as any]) {
    return window[TUONO_CONTEXT as any]
  }

  window[TUONO_CONTEXT as any] = routerContext as any

  return routerContext
}
