import { TUONO_MAIN_PACKAGE, TUONO_DYNAMIC_FN_ID } from './constants'
import type * as t from '@babel/types'

import type { Identifier, ImportDeclaration } from '@babel/types'

export const isTuonoDynamicFnImported = (
  path: babel.NodePath<t.ImportSpecifier>,
): boolean => {
  if ((path.node.imported as Identifier).name !== TUONO_DYNAMIC_FN_ID) {
    return false
  }
  if (
    (path.parentPath.node as ImportDeclaration).source.value !==
    TUONO_MAIN_PACKAGE
  ) {
    return false
  }
  return true
}
