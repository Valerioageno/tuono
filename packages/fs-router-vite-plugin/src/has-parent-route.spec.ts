import { describe, it, expect } from 'vitest'
import { hasParentRoute } from './has-parent-route'

const routes = [
  {
    filePath: 'posts/__root.tsx',
    fullPath:
      '/tuono/packages/fs-router-vite-plugin/tests/generator/multi-level-root/routes/posts/__root.tsx',
    routePath: '/posts/__root',
    variableName: 'Postsroot',
    path: '/posts/__root',
    cleanedPath: '/posts',
  },
  {
    filePath: 'index.tsx',
    fullPath:
      '/tuono/packages/fs-router-vite-plugin/tests/generator/multi-level-root/routes/index.tsx',
    routePath: '/',
    variableName: 'Index',
    path: '/',
    cleanedPath: '/',
  },
  {
    filePath: 'posts/my-post.tsx',
    fullPath:
      '/tuono/packages/fs-router-vite-plugin/tests/generator/multi-level-root/routes/posts/my-post.tsx',
    routePath: '/posts/my-post',
    variableName: 'PostsMyPost',
    path: '/posts/my-post',
    cleanedPath: '/posts/my-post',
  },
]

const parent = {
  filePath: 'posts/__root.tsx',
  fullPath:
    '/tuono/packages/fs-router-vite-plugin/tests/generator/multi-level-root/routes/posts/__root.tsx',
  routePath: '/posts/__root',
  variableName: 'Postsroot',
  path: '/posts/__root',
  cleanedPath: '/posts',
}

const route = {
  filePath: 'posts/my-post.tsx',
  fullPath:
    '/tuono/packages/fs-router-vite-plugin/tests/generator/multi-level-root/routes/posts/my-post.tsx',
  routePath: '/posts/my-post',
  variableName: 'PostsMyPost',
  path: '/posts/my-post',
  cleanedPath: '/posts/my-post',
}

describe('hasParentRoute works', async () => {
  it('Should detect parent route', () => {
    const parentRoute = hasParentRoute(routes, route, route.path)
    expect(parentRoute).toStrictEqual(parent)
  })
})
