import { expectTypeOf, test } from 'vitest'
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '../../src'

const rootRoute = createRootRoute()

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
})

const invoicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/invoices',
})

const routeTree = rootRoute.addChildren([invoicesRoute, indexRoute])

const defaultRouter = createRouter({
  routeTree,
})

type DefaultRouter = typeof defaultRouter

test('can pass default router to the provider', () => {
  expectTypeOf(RouterProvider).parameter(0).toMatchTypeOf<{
    router: DefaultRouter
    routeTree?: DefaultRouter['routeTree']
  }>()
})
