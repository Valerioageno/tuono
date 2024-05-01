/**
 * Overview:
 *
 * src/routes							=	Routes entry point
 * src/routes/layout.tsx				=	Shared layout
 * src/routes/index.tsx					=	xyz.com
 * src/routes/about.tsx					=	xyz.com/about
 * src/routes/about-loading.tsx			=	xyz.com/about - while loading data
 * src/routes/about/index.tsx			=	xyz.com/about
 * src/routes/posts/[slug].tsx			=	xyz.com/posts/my-lovely-post
 * src/routes/posts/[...params].tsx		=	xyz.com/posts/my-lovely-post/commend-id-304
 * src/routes/404.tsx					=	Not found
 *
 * public/								=	Public files
 *
 * All the routes are lazy loaded!
 */

import * as fs from 'fs'
import * as fsp from 'fs/promises'
import { format } from 'prettier'
import path from 'path'

const ROUTES_FOLDER = './src/routes/'
const ROOT_PATH_ID = '__root'
const GENERATED_ROUTE_TREE = './src/routeTree.gen.ts'

let latestTask = 0
const routeGroupPatternRegex = /\(.+\)/g

interface RouteNode {
  filePath: string
  fullPath: string
  routePath: string
  path?: string
  cleanedPath?: string
  isLayout?: boolean
  isLoader: boolean
  children?: RouteNode[]
  parent?: RouteNode
  variableName?: string
}

let isFirst = false
let skipMessage = false

export function removeExt(d: string, keepExtension: boolean = false): string {
  return keepExtension ? d : d.substring(0, d.lastIndexOf('.')) || d
}

function replaceBackslash(s: string): string {
  return s.replaceAll(/\\/gi, '/')
}

export function cleanPath(pathToClean: string): string {
  // remove double slashes
  return pathToClean.replace(/\/{2,}/g, '/')
}

function removeUnderscores(s?: string): string | undefined {
  return s?.replaceAll(/(^_|_$)/gi, '').replaceAll(/(\/_|_\/)/gi, '/')
}

function routePathToVariable(routePath: string): string {
  return (
    removeUnderscores(routePath)
      ?.replace(/\/\$\//g, '/splat/')
      .replace(/\$$/g, 'splat')
      .replace(/\$/g, '')
      .split(/[/-]/g)
      .map((d, i) => (i > 0 ? capitalize(d) : d))
      .join('')
      .replace(/([^a-zA-Z0-9]|[.])/gm, '')
      .replace(/^(\d)/g, 'R$1') ?? ''
  )
}

function capitalize(s: string): string {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

async function getRouteNodes(config = defaultConfig): Promise<RouteNode[]> {
  const routeNodes: RouteNode[] = []

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
        }
      }),
    )
  }

  await recurse('./')

  return routeNodes
}

export function multiSortBy<T>(
  arr: T[],
  accessors: ((item: T) => any)[] = [(d): any => d],
): T[] {
  return arr
    .map((d, i) => [d, i] as const)
    .sort(([a, ai], [b, bi]) => {
      for (const accessor of accessors) {
        const ao = accessor(a)
        const bo = accessor(b)

        if (typeof ao === 'undefined') {
          if (typeof bo === 'undefined') {
            continue
          }
          return 1
        }

        if (ao === bo) {
          continue
        }

        return ao > bo ? 1 : -1
      }

      return ai - bi
    })
    .map(([d]) => d)
}

/**
 * @deprecated
 */
interface RouteSubNode {
  component?: RouteNode
  errorComponent?: RouteNode
  pendingComponent?: RouteNode
  loader?: RouteNode
  lazy?: RouteNode
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

interface Config {
  folderName: string
  generatedRouteTree: string
}

const defaultConfig: Config = {
  folderName: ROUTES_FOLDER,
  generatedRouteTree: GENERATED_ROUTE_TREE,
}

export async function routeGenerator(config = defaultConfig): Promise<void> {
  if (!isFirst) {
    console.log('Generating routes...')
    isFirst = true
  } else if (skipMessage) {
    skipMessage = false
  } else {
    console.log('Regenerating routes')
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

  const start = Date.now()
  const beforeRouteNodes = await getRouteNodes(config)

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

  const routeTree: RouteNode[] = []
  const routePiecesByPath: Record<string, RouteSubNode> = {}

  // Loop over the flat list of routeNodes and
  // build up a tree based on the routeNodes' routePath
  const routeNodes: RouteNode[] = []

  const handleNode = async (node: RouteNode): Promise<void> => {
    const parentRoute = hasParentRoute(routeNodes, node, node.routePath)

    if (parentRoute) node.parent = parentRoute

    node.path = determineNodePath(node)

    const trimmedPath = trimPathLeft(node.path ?? '')
    const split = trimmedPath.split('/')
    const first = split[0] ?? trimmedPath
    const lastRouteSegment = split[split.length - 1] ?? trimmedPath

    // TODO: check these two
    node.isNonPath = lastRouteSegment.startsWith('_')
    node.isNonLayout = first.endsWith('_')

    node.cleanedPath = removeGroups(
      removeUnderscores(removeLayoutSegments(node.path)) ?? '',
    )

    const routeCode = fs.readFileSync(node.fullPath, 'utf-8')

    const escapedRoutePath = removeTrailingUnderscores(
      node.routePath.replaceAll('$', '$$') ?? '',
    )

    let replaced = routeCode

    if (!routeCode) {
      replaced = [
        `import { createFileRoute } from '@tanstack/react-router'`,
        `export const Route = createFileRoute('${escapedRoutePath}')({
  component: () => <div>Hello ${escapedRoutePath}!</div>
})`,
      ].join('\n\n')

      if (replaced !== routeCode) {
        console.log(`[emoticon] Updating ${node.fullPath}`)
        await fsp.writeFile(node.fullPath, replaced)
      }
    }

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

  const routeConfigChildrenText = buildRouteConfig(routeTree)

  const sortedRouteNodes = multiSortBy(routeNodes, [
    (d): number => (d.routePath.includes(`/${ROOT_PATH_ID}`) ? -1 : 1),
    (d): number => d.routePath.split('/').length,
    (d): number => (d.routePath.endsWith("index'") ? -1 : 1),
    (d): any => d,
  ])

  const imports = Object.entries({
    createFileRoute: false,
    lazyFn: sortedRouteNodes.some(
      (node) => routePiecesByPath[node.routePath]?.loader,
    ),
    lazyRouteComponent: sortedRouteNodes.some(
      (node) =>
        routePiecesByPath[node.routePath]?.component ||
        routePiecesByPath[node.routePath]?.errorComponent ||
        routePiecesByPath[node.routePath]?.pendingComponent,
    ),
  })
    .filter((d) => d[1])
    .map((d) => d[0])

  const routeImports = [
    '// This file is auto-generated by Tuono',
    imports.length
      ? `import { ${imports.join(', ')} } from '@tanstack/react-router'\n`
      : '',
    '// Import Routes',
    [
      `import { Route as rootRoute } from './${replaceBackslash(
        path.relative(
          path.dirname(config.generatedRouteTree),
          path.resolve(config.folderName, ROOT_PATH_ID),
        ),
      )}'`,
      ...sortedRouteNodes.map((node) => {
        return `import { Route as ${
          node.variableName
        }Import } from './${replaceBackslash(
          removeExt(
            path.relative(
              path.dirname(config.generatedRouteTree),
              path.resolve(config.folderName, node.filePath),
            ),
            false,
          ),
        )}'`
      }),
    ].join('\n'),
    '// Create/Update Routes',
    sortedRouteNodes
      .map((node) => {
        const loaderNode = routePiecesByPath[node.routePath]?.loader
        const lazyComponentNode = routePiecesByPath[node.routePath]?.lazy

        return [
          `const ${node.variableName}Route = ${node.variableName}Import.update({
          ${[
            `path: '${node.cleanedPath}'`,
            `getParentRoute: () => ${node.parent?.variableName ?? 'root'}Route`,
          ]
            .filter(Boolean)
            .join(',')}
        } as any)`,
          loaderNode
            ? `.updateLoader({ loader: lazyFn(() => import('./${replaceBackslash(
                removeExt(
                  path.relative(
                    path.dirname(config.generatedRouteTree),
                    path.resolve(config.folderName, loaderNode.filePath),
                  ),
                  false,
                ),
              )}'), 'loader') })`
            : '',
          lazyComponentNode
            ? `.lazy(() => import('./${replaceBackslash(
                removeExt(
                  path.relative(
                    path.dirname(config.generatedRouteTree),
                    path.resolve(config.folderName, lazyComponentNode.filePath),
                  ),
                  false,
                ),
              )}').then((d) => d.Route))`
            : '',
        ].join('')
      })
      .join('\n\n'),
    ...[
      '// Populate the FileRoutesByPath interface',
      `declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    ${routeNodes
      .map((routeNode) => {
        return `'${removeTrailingUnderscores(routeNode.routePath)}': {
          preLoaderRoute: typeof ${routeNode.variableName}Import
          parentRoute: typeof ${
            routeNode.parent?.variableName
              ? `${routeNode.parent.variableName}Import`
              : 'rootRoute'
          }
        }`
      })
      .join('\n')}
  }
}`,
    ],
    '// Create and export the route tree',
    `export const routeTree = rootRoute.addChildren([${routeConfigChildrenText}])`,
  ]
    .filter(Boolean)
    .join('\n\n')

  console.log(routeImports)

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

  console.log(
    `[emoticon] Processed ${routeNodes.length === 1 ? 'route' : 'routes'} in ${
      Date.now() - start
    }ms`,
  )
}

function spaces(d: number): string {
  return Array.from({ length: d })
    .map(() => ' ')
    .join('')
}

function removeTrailingUnderscores(s?: string): string | undefined {
  return s?.replaceAll(/(_$)/gi, '').replaceAll(/(_\/)/gi, '/')
}
/**
 * Removes all segments from a given path that start with an underscore ('_').
 *
 * @param {string} routePath - The path from which to remove segments. Defaults to '/'.
 * @returns {string} The path with all underscore-prefixed segments removed.
 * @example
 * removeLayoutSegments('/workspace/_auth/foo') // '/workspace/foo'
 */
function removeLayoutSegments(routePath: string = '/'): string {
  const segments = routePath.split('/')
  const newSegments = segments.filter((segment) => !segment.startsWith('_'))
  return newSegments.join('/')
}

function removeGroups(s: string): string {
  return s.replaceAll(routeGroupPatternRegex, '').replaceAll('//', '/')
}
export function trimPathLeft(pathToTrim: string): string {
  return pathToTrim === '/' ? pathToTrim : pathToTrim.replace(/^\/{1,}/, '')
}

/**
 * The `node.path` is used as the `id` in the route definition.
 * This function checks if the given node has a parent and if so, it determines the correct path for the given node.
 * @param node - The node to determine the path for.
 * @returns The correct path for the given node.
 */
function determineNodePath(node: RouteNode): string {
  return (node.path = node.parent
    ? node.routePath.replace(node.parent.routePath, '') || '/'
    : node.routePath)
}
