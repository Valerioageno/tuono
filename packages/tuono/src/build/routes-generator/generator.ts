import * as fs from 'fs'
import * as fsp from 'fs/promises'
import path from 'path'

import {
  cleanPath,
  determineNodePath,
  multiSortBy,
  spaces,
  replaceBackslash,
  removeExt,
  routePathToVariable,
  removeGroups,
  removeUnderscores,
  removeLayoutSegments,
} from './utils'

import type { Config, RouteNode, RouteSubNode } from './types'

import { format } from 'prettier'

const ROUTES_FOLDER = './src/routes/'
const ROOT_PATH_ID = '__root'
const GENERATED_ROUTE_TREE = './.tuono/routeTree.gen.ts'

let latestTask = 0

const defaultConfig: Config = {
  folderName: ROUTES_FOLDER,
  generatedRouteTree: GENERATED_ROUTE_TREE,
}

let isFirst = false
let skipMessage = false

async function getRouteNodes(
  config = defaultConfig,
): Promise<{ routeNodes: RouteNode[]; rustHandlersNodes: string[] }> {
  const routeNodes: RouteNode[] = []
  const rustHandlersNodes: string[] = []

  async function recurse(dir: string): Promise<void> {
    const fullDir = path.resolve(config.folderName, dir)
    const dirList = await fsp.readdir(fullDir, { withFileTypes: true })

    await Promise.all(
      dirList.map(async (dirent) => {
        const fullPath = path.join(fullDir, dirent.name)
        const relativePath = path.join(dir, dirent.name)

        if (dirent.isDirectory()) {
          await recurse(relativePath)
        } else if (fullPath.match(/\.(tsx|ts|jsx|js)$/)) {
          const filePath = replaceBackslash(path.join(dir, dirent.name))
          const filePathNoExt = removeExt(filePath)
          let routePath =
            cleanPath(`/${filePathNoExt.split('.').join('/')}`) || ''

          const variableName = routePathToVariable(routePath)

          // Remove the index from the route path and
          // if the route path is empty, use `/'

          const isLoader = routePath.includes('-loading')

          if (routePath === 'index') {
            routePath = '/'
          }

          routePath = routePath.replace(/\/index$/, '/') || '/'

          routeNodes.push({
            filePath,
            fullPath,
            routePath,
            isLoader,
            variableName,
          })
        } else if (fullPath.match(/\.(rs)$/)) {
          const filePath = replaceBackslash(path.join(dir, dirent.name))
          const filePathNoExt = removeExt(filePath)
          let routePath =
            cleanPath(`/${filePathNoExt.split('.').join('/')}`) || ''

          if (routePath === 'index') {
            routePath = '/'
          }

          routePath = routePath.replace(/\/index$/, '/') || '/'

          rustHandlersNodes.push(routePath)
        }
      }),
    )
  }

  await recurse('./')

  return { routeNodes, rustHandlersNodes }
}

export function hasParentRoute(
  routes: RouteNode[],
  node: RouteNode,
  routePathToCheck: string | undefined,
): RouteNode | null {
  if (!routePathToCheck || routePathToCheck === '/') {
    return null
  }

  const sortedNodes = multiSortBy(routes, [
    (d): number => d.routePath.length * -1,
    (d): string | undefined => d.variableName,
  ]).filter((d) => d.routePath !== `/${ROOT_PATH_ID}`)

  for (const route of sortedNodes) {
    if (route.routePath === '/') continue

    if (
      routePathToCheck.startsWith(`${route.routePath}/`) &&
      route.routePath !== routePathToCheck
    ) {
      return route
    }
  }

  const segments = routePathToCheck.split('/')
  segments.pop() // Remove the last segment
  const parentRoutePath = segments.join('/')

  return hasParentRoute(routes, node, parentRoutePath)
}

export async function routeGenerator(config = defaultConfig): Promise<void> {
  if (!isFirst) {
    isFirst = true
  } else if (skipMessage) {
    skipMessage = false
  }

  const checkLatest = (): boolean => {
    if (latestTask !== taskId) {
      skipMessage = true
      return false
    }

    return true
  }

  const taskId = latestTask + 1
  latestTask = taskId

  const { routeNodes: beforeRouteNodes, rustHandlersNodes } =
    await getRouteNodes(config)

  const preRouteNodes = multiSortBy(beforeRouteNodes, [
    (d): number => (d.routePath === '/' ? -1 : 1),
    (d): number => d.routePath.split('/').length,
    (d): number => (d.filePath.match(/[./]index[.]/) ? 1 : -1),
    (d): number =>
      d.filePath.match(
        /[./](component|errorComponent|pendingComponent|loader|lazy)[.]/,
      )
        ? 1
        : -1,
    (d): number => (d.filePath.match(/[./]route[.]/) ? -1 : 1),
    (d): number => (d.routePath.endsWith('/') ? -1 : 1),
    (d): string => d.routePath,
  ]).filter((d) => ![`/${ROOT_PATH_ID}`].includes(d.routePath || ''))

  const routePiecesByPath: Record<string, RouteSubNode> = {}

  // Loop over the flat list of routeNodes and
  // build up a tree based on the routeNodes' routePath
  const routeNodes: RouteNode[] = []

  const handleNode = async (node: RouteNode): Promise<void> => {
    const parentRoute = hasParentRoute(routeNodes, node, node.routePath)

    if (parentRoute) node.parent = parentRoute

    node.path = determineNodePath(node)

    node.cleanedPath = removeGroups(
      removeUnderscores(removeLayoutSegments(node.path)) ?? '',
    )

    if (node.parent) {
      node.parent.children = node.parent.children ?? []
      node.parent.children.push(node)
    }
    routeNodes.push(node)
  }

  for (const node of preRouteNodes) {
    await handleNode(node)
  }

  function buildRouteConfig(nodes: RouteNode[], depth = 1): string {
    const children = nodes.map((node) => {
      if (node.isLayout) {
        return
      }

      if (node.isLayout && !node.children?.length) {
        return
      }

      const route = `${node.variableName}Route`

      if (node.children?.length) {
        const childConfigs = buildRouteConfig(node.children, depth + 1)
        return `${route}.addChildren([${spaces(depth * 4)}${childConfigs}])`
      }

      return route
    })

    return children.filter(Boolean).join(`,`)
  }

  const routeConfigChildrenText = buildRouteConfig(routeNodes)

  const sortedRouteNodes = multiSortBy(routeNodes, [
    (d): number => (d.routePath.includes(`/${ROOT_PATH_ID}`) ? -1 : 1),
    (d): number => d.routePath.split('/').length,
    (d): number => (d.routePath.endsWith("index'") ? -1 : 1),
    (d): any => d,
  ])

  const imports = [
    ...sortedRouteNodes.map((node) => {
      return `const ${
        node.variableName
      }Import = dynamic(() => import('./${replaceBackslash(
        removeExt(
          path.relative(
            path.dirname(config.generatedRouteTree),
            path.resolve(config.folderName, node.filePath),
          ),
          false,
        ),
      )}'))`
    }),
  ].join('\n')

  const createRoutes = [
    ...sortedRouteNodes.map((node) => {
      return `const ${node.variableName} = createRoute({ component: ${node.variableName}Import })`
    }),
  ].join('\n')

  const createRouteUpdates = [
    sortedRouteNodes
      .map((node) => {
        return [
          `const ${node.variableName}Route = ${node.variableName}.update({
          ${[
            `path: '${node.cleanedPath}'`,
            `getParentRoute: () => ${node.parent?.variableName ?? 'root'}Route`,
            rustHandlersNodes.includes(node.path || '')
              ? 'hasHandler: true'
              : '',
          ]
            .filter(Boolean)
            .join(',')}
        })`,
        ].join('')
      })
      .join('\n\n'),
  ]

  const routeImports = [
    '// This file is auto-generated by Tuono',
    "import { createRoute, dynamic } from 'tuono'",
    [
      `import RootImport from './${replaceBackslash(
        path.relative(
          path.dirname(config.generatedRouteTree),
          path.resolve(config.folderName, ROOT_PATH_ID),
        ),
      )}'`,
    ].join('\n'),
    imports,
    'const rootRoute = createRoute({ isRoot: true, component: RootImport });',
    createRoutes,
    '// Create/Update Routes',
    createRouteUpdates,
    '// Create and export the route tree',
    `export const routeTree = rootRoute.addChildren([${routeConfigChildrenText}])`,
  ]
    .filter(Boolean)
    .join('\n\n')

  const routeConfigFileContent = await format(routeImports, {
    semi: false,
    singleQuote: true,
    parser: 'typescript',
  })

  const routeTreeContent = await fsp
    .readFile(path.resolve(config.generatedRouteTree), 'utf-8')
    .catch((err: any) => {
      if (err.code === 'ENOENT') {
        return undefined
      }
      throw err
    })

  if (!checkLatest()) return

  if (routeTreeContent !== routeConfigFileContent) {
    await fsp.mkdir(path.dirname(path.resolve(config.generatedRouteTree)), {
      recursive: true,
    })
    if (!checkLatest()) return
    await fsp.writeFile(
      path.resolve(config.generatedRouteTree),
      routeConfigFileContent,
    )
  }
}
