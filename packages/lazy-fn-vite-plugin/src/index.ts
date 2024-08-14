import type { Plugin } from 'vite'
import * as babel from '@babel/core'
import type { PluginItem } from '@babel/core'

import {
  TUONO_MAIN_PACKAGE,
  TUONO_DYNAMIC_FN_ID,
  TUONO_LAZY_FN_ID,
} from './constants'

import * as t from '@babel/types'

import type {
  Identifier,
  ImportDeclaration,
  CallExpression,
  ArrowFunctionExpression,
  StringLiteral,
} from '@babel/types'

/**
 * [SERVER build]
 * This plugin just removes the `dynamic` imported function from any tuono import
 */
const RemoveTuonoLazyImport: PluginItem = {
  name: 'remove-tuono-lazy-import-plugin',
  visitor: {
    ImportSpecifier: (path) => {
      if ((path.node.imported as Identifier).name === TUONO_DYNAMIC_FN_ID) {
        if (
          (path.parentPath.node as ImportDeclaration).source.value ===
          TUONO_MAIN_PACKAGE
        ) {
          path.remove()
        }
      }
    },
  },
}

/**
 * [CLIENT build]
 * This plugin replace the `dynamic` function with the `lazyLoadComponent` one
 */
const ReplaceTuonoLazyImport: PluginItem = {
  name: 'remove-tuono-lazy-import-plugin',
  visitor: {
    ImportSpecifier: (path) => {
      if ((path.node.imported as Identifier).name === TUONO_DYNAMIC_FN_ID) {
        if (
          (path.parentPath.node as ImportDeclaration).source.value ===
          TUONO_MAIN_PACKAGE
        ) {
          ;(path.node.imported as Identifier).name = TUONO_LAZY_FN_ID
        }
      }
    },
  },
}

/**
 * [SERVER build]
 * This plugin statically imports the lazy loaded components
 */
const TurnLazyIntoStaticImport: PluginItem = {
  name: 'turn-lazy-into-static-import-plugin',
  visitor: {
    VariableDeclaration: (path) => {
      path.node.declarations.forEach((el) => {
        const init = el.init as CallExpression
        if ((init.callee as Identifier).name === TUONO_DYNAMIC_FN_ID) {
          const importName = (el.id as Identifier).name
          const importPath = (
            (
              (init.arguments[0] as ArrowFunctionExpression)
                .body as CallExpression
            ).arguments[0] as StringLiteral
          ).value

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
    transform(code, _id, opts): string | undefined | null {
      if (
        code.includes(TUONO_DYNAMIC_FN_ID) &&
        code.includes(TUONO_MAIN_PACKAGE)
      ) {
        const res = babel.transformSync(code, {
          plugins: [
            ['@babel/plugin-syntax-jsx', {}],
            ['@babel/plugin-syntax-typescript', { isTSX: true }],
            [!opts?.ssr ? ReplaceTuonoLazyImport : []],
            [opts?.ssr ? RemoveTuonoLazyImport : []],
            [opts?.ssr ? TurnLazyIntoStaticImport : []],
          ],
          sourceMaps: true,
        })

        return res?.code
      }
      return code
    },
  }
}
