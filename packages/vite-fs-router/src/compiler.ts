import * as babel from '@babel/core'
import * as t from '@babel/types'
import { eliminateUnreferencedIdentifiers } from './eliminateUnreferencedIdentifiers'
import { SPLIT_PREFIX } from './constants'
import type { BabelFileResult } from '@babel/core'

type SplitModulesById = Record<
  string,
  { id: string; node: t.FunctionExpression }
>

interface State {
  filename: string
  opts: {
    minify: boolean
    root: string
  }
  imported: Record<string, boolean>
  refs: Set<any>
  serverIndex: number
  splitIndex: number
  splitModulesById: SplitModulesById
}

interface MakeCompileFnArgs {
  root: string
}

interface MakeCompileFnReturnArgs {
  code: string
  filename: string
  getBabelConfig: () => { plugins: any[] }
}

interface CompileOutput {
  code: string
  map: BabelFileResult['map']
}

type SplitNodeType = (typeof splitNodeTypes)[number]

export const makeCompile = ({
  root,
}: MakeCompileFnArgs): ((args: MakeCompileFnReturnArgs) => CompileOutput) => {
  return ({ code, getBabelConfig, filename }) => {
    const res = babel.transformSync(code, {
      plugins: [
        ['@babel/plugin-syntax-jsx', {}],
        ['@babel/plugin-syntax-typescript', { isTSX: true }],
        ...getBabelConfig().plugins,
      ],
      root,
      filename,
      sourceMaps: true,
    })

    if (res?.code) {
      return {
        code: res.code,
        map: res.map,
      }
    }

    return {
      code,
      map: null,
    }
  }
}

interface SplitFileFnArgs {
  code: string
  compile: (args: MakeCompileFnReturnArgs) => CompileOutput
  filename: string
}

// NOTE: We don't need the loader
const splitNodeTypes = ['component', 'loader'] as const

// Reusable function to get literal value or resolve variable to literal
function resolveIdentifier(path: any, node: any) {
  if (t.isIdentifier(node)) {
    const binding = path.scope.getBinding(node.name)
    if (binding) {
      const declarator = binding.path.node
      if (t.isObjectExpression(declarator.init)) {
        return declarator.init
      } else if (t.isFunctionDeclaration(declarator.init)) {
        return declarator.init
      }
    }
    return undefined
  }

  return node
}

export const splitFile = async ({
  code,
  compile,
  filename,
}: SplitFileFnArgs): Promise<void> => {
  console.log('Split file [splitFile fn]', code)
  return compile({
    code,
    filename,
    getBabelConfig: () => ({
      plugins: [
        [
          {
            visitor: {
              Program: {
                enter(
                  programPath: babel.NodePath<t.Program>,
                  state: State,
                ): void {
                  const splitNodesByType: Record<
                    SplitNodeType,
                    t.Node | undefined
                  > = {
                    component: undefined,
                    loader: undefined,
                  }

                  // Find the node
                  // NOTE: I'd use a more NextJS approach.
                  // All the "default exported" fns are the page.
                  programPath.traverse(
                    {
                      CallExpression: (path) => {
                        if (path.node.callee.type === 'Identifier') {
                          // TODO: Update this to support just "default exported" fns
                          if (path.node.callee.name === 'createFileRoute') {
                            if (
                              path.parentPath.node.type === 'CallExpression'
                            ) {
                              const options = resolveIdentifier(
                                path,
                                path.parentPath.node.arguments[0],
                              )

                              if (t.isObjectExpression(options)) {
                                options.properties.forEach((prop) => {
                                  if (t.isObjectProperty(prop)) {
                                    splitNodeTypes.forEach((type) => {
                                      if (t.isIdentifier(prop.key)) {
                                        if (prop.key.name === 'type') {
                                          splitNodesByType[type] = prop.value
                                        }
                                      }
                                    })
                                  }
                                })

                                // Remove all of the options
                                options.properties = []
                              }
                            }
                          }
                        }
                      },
                    },
                    state,
                  )

                  // TODO: We don't need to iterate since we don't support the loader
                  splitNodeTypes.forEach((splitType) => {
                    let splitNode = splitNodesByType[splitType]

                    if (!splitNode) {
                      return
                    }

                    while (t.isIdentifier(splitNode)) {
                      const binding = programPath.scope.getBinding(
                        splitNode.name,
                      )
                      splitNode = binding?.path.node
                    }

                    // Add the node to the program
                    if (splitNode) {
                      if (t.isFunctionDeclaration(splitNode)) {
                        programPath.pushContainer(
                          'body',
                          t.variableDeclaration('const', [
                            t.variableDeclarator(
                              t.identifier(splitType),
                              t.functionExpression(
                                splitNode.id || null,
                                splitNode.params,
                                splitNode.body,
                                splitNode.generator,
                                splitNode.async,
                              ),
                            ),
                          ]),
                        )
                      } else if (
                        t.isFunctionExpression(splitNode) ||
                        t.isArrowFunctionExpression(splitNode)
                      ) {
                        programPath.pushContainer(
                          'body',
                          t.variableDeclaration('const', [
                            t.variableDeclarator(
                              t.identifier(splitType),
                              splitType as any,
                            ),
                          ]),
                        )
                      } else if (t.isImportSpecifier(splitNode)) {
                        programPath.pushContainer(
                          'body',
                          t.variableDeclaration('const', [
                            t.variableDeclarator(
                              t.identifier(splitType),
                              splitNode.local,
                            ),
                          ]),
                        )
                      } else {
                        console.log(splitNode)
                        throw new Error(
                          `Unexpected splitNode type ${splitNode.type}`,
                        )
                      }
                    }

                    // If the splitNode exists at the top of the program
                    // then we need to remove that copy
                    programPath.node.body = programPath.node.body.filter(
                      (node) => {
                        return node !== splitNode
                      },
                    )

                    // Export the node
                    programPath.pushContainer('body', [
                      t.exportNamedDeclaration(null, [
                        t.exportSpecifier(
                          t.identifier(splitType),
                          t.identifier(splitType),
                        ),
                      ]),
                    ])
                  })

                  // Convert exports to imports from the original file
                  programPath.traverse({
                    ExportNamedDeclaration(path) {
                      // e.g. export const x = 1 or export { x }
                      // becomes
                      // import { x } from '${opts.id}'
                      if (path.node.declaration) {
                        if (t.isVariableDeclaration(path.node.declaration)) {
                          path.replaceWith(
                            t.importDeclaration(
                              path.node.declaration.declarations.map((decl) =>
                                t.importSpecifier(
                                  t.identifier((decl.id as any).name),
                                  t.identifier((decl.id as any).name),
                                ),
                              ),
                              t.stringLiteral(
                                filename.split(`?${SPLIT_PREFIX}`)[0] as string,
                              ),
                            ),
                          )
                        }
                      }
                    },
                  })

                  eliminateUnreferencedIdentifiers(programPath)
                },
              },
            },
          },
        ],
      ],
    }),
  })
}
