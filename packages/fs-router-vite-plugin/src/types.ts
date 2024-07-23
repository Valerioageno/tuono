export interface RouteNode {
  filePath: string
  fullPath: string
  routePath: string
  path?: string
  cleanedPath?: string
  isLayout?: boolean
  children?: RouteNode[]
  parent?: RouteNode
  variableName?: string
}

export interface Config {
  folderName: string
  generatedRouteTree: string
}
