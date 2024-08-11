import { afterEach, describe, expect, test, vi } from 'vitest'
import { getRouteByPathname } from './Matches'
import { cleanup } from '@testing-library/react'

describe('Test getRouteByPathname fn', () => {
  afterEach(() => {
    cleanup()
  })

  test('match routes by ids', () => {
    vi.mock('../hooks/useInternalRouter.tsx', () => ({
      useInternalRouter: (): { routesById: Record<string, any> } => {
        return {
          routesById: {
            '/': { id: '/' },
            '/about': { id: '/about' },
            '/posts/': { id: '/posts/' }, // posts/index
            '/posts/[post]': { id: '/posts/[post]' },
            '/posts/defined-post': { id: '/posts/defined-post' },
            '/posts/[post]/[comment]': { id: '/posts/[post]/[comment]' },
          },
        }
      },
    }))

    expect(getRouteByPathname('/')?.id).toBe('/')
    expect(getRouteByPathname('/not-found')?.id).toBe(undefined)
    expect(getRouteByPathname('/about')?.id).toBe('/about')
    expect(getRouteByPathname('/posts/')?.id).toBe('/posts/')
    expect(getRouteByPathname('/posts/dynamic-post')?.id).toBe('/posts/[post]')
    expect(getRouteByPathname('/posts/defined-post')?.id).toBe(
      '/posts/defined-post',
    )
    expect(getRouteByPathname('/posts/dynamic-post/dynamic-comment')?.id).toBe(
      '/posts/[post]/[comment]',
    )
  })
})
