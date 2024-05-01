export interface RouteNode {
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

/**
 * @deprecated
 */
export interface RouteSubNode {
  component?: RouteNode
  errorComponent?: RouteNode
  pendingComponent?: RouteNode
  loader?: RouteNode
  lazy?: RouteNode
}

export interface Config {
  folderName: string
  generatedRouteTree: string
}
