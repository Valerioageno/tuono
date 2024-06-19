import type { Plugin } from 'vite'
import * as babel from '@babel/core'
import { PluginItem } from '@babel/core'

import * as t from '@babel/types'
import type {
  Identifier,
  ImportDeclaration,
  CallExpression,
  ArrowFunctionExpression,
  StringLiteral,
} from '@babel/types'

/**
 * This plugin just removes the `lazy` imported function from any tuono import
 */
const RemoveTuonoLazyImport: PluginItem = {
  name: 'remove-tuono-lazy-import-plugin',
  visitor: {
    ImportSpecifier: (path) => {
      if ((path.node.imported as Identifier)?.name === 'lazy') {
        if (
          (path.parentPath.node as ImportDeclaration)?.source.value === 'tuono'
        ) {
          path.remove()
        }
      }
    },
  },
}

/**
 * Import { lazy } from 'react'
 */
const ImportReactLazy: PluginItem = {
  name: 'import-react-lazy-plugin',
  visitor: {
    Program: (path) => {
      let isReactImported = false
      path.node.body.forEach((val) => {
        if (val.type === 'ImportDeclaration' && val.source.value === 'react') {
          isReactImported = true
          // TODO: Handle also here case of already imported react
          // Right now works just for the main routes file
        }
      })

      if (!isReactImported) {
        const importDeclaration = t.importDeclaration(
          [t.importSpecifier(t.identifier('lazy'), t.identifier('lazy'))],
          t.stringLiteral('react'),
        )
        path.unshiftContainer('body', importDeclaration)
      }
    },
  },
}

/**
 * For the server side we need to statically import the lazy loaded components
 */
const TurnLazyToStaticImport: PluginItem = {
  name: 'turn-lazy-to-static-import-plugin',
  visitor: {
    VariableDeclaration: (path) => {
      path.node.declarations.forEach((el) => {
        const init = el.init as CallExpression
        if ((init?.callee as Identifier)?.name === 'lazy') {
          const importName = (el.id as Identifier)?.name
          const importPath = (
            (
              (init.arguments[0] as ArrowFunctionExpression)
                ?.body as CallExpression
            )?.arguments[0] as StringLiteral
          )?.value

          if (importName && importPath) {
            const importDeclaration = t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier(importName))],
              t.stringLiteral(importPath),
            )

            path.replaceWith(importDeclaration)
          }
        }
      })
    },
  },
}

export function LazyLoadingPlugin(): Plugin {
  return {
    name: 'vite-plugin-tuono-lazy-loading',
    enforce: 'pre',
    transform(code, _id, opts) {
      if (code.includes('lazy') && code.includes('tuono')) {
        const res = babel.transformSync(code, {
          plugins: [
            ['@babel/plugin-syntax-jsx', {}],
            ['@babel/plugin-syntax-typescript', { isTSX: true }],
            [RemoveTuonoLazyImport],
            [!opts?.ssr ? ImportReactLazy : []],
            [opts?.ssr ? TurnLazyToStaticImport : []],
          ],
          sourceMaps: true,
        })

        return res?.code
      }
      return code
    },
  }
}
