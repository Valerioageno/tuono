import type {
  Identifier,
  ImportDeclaration,
  ImportSpecifier,
} from '@babel/types'

import { TUONO_MAIN_PACKAGE, TUONO_DYNAMIC_FN_ID } from './constants'

export const isTuonoDynamicFnImported = (
  path: babel.NodePath<ImportSpecifier>,
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
