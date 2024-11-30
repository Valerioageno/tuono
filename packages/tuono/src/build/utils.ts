import path from 'path'

import type { AliasOptions } from 'vite'

import type { TuonoConfig } from '../config'

import {
  DOT_TUONO_FOLDER_NAME,
  CONFIG_FOLDER_NAME,
  CONFIG_FILE_NAME,
} from './constants'

/**
 *  Normalize vite alias option:
 * - If the path is relative, transform it to absolute, prepending the tuono root folder
 * - If the path is absolute, remove the ".tuono/config/" path from it
 */
const normalizeAliasPath = (filePath: string): string => {
  if (path.isAbsolute(filePath)) {
    return filePath.replace(
      path.join(DOT_TUONO_FOLDER_NAME, CONFIG_FOLDER_NAME),
      '',
    )
  }

  return path.join(process.cwd(), filePath)
}

/**
 * From a given vite aliasOptions apply {@link normalizeAliasPath} for each alias.
 *
 * The config is bundled by `vite` and emitted inside {@link DOT_TUONO_FOLDER_NAME}/{@link CONFIG_FOLDER_NAME}.
 * According to this, we have to ensure that the aliases provided by the user are updated to refer to the right folders.
 *
 * @see https://github.com/Valerioageno/tuono/pull/153#issuecomment-2508142877
 */
const normalizeViteAlias = (alias?: AliasOptions): AliasOptions | undefined => {
  if (!alias) return

  if (Array.isArray(alias)) {
    return alias.map(({ find, replacement }) => ({
      find,
      replacement: normalizeAliasPath(replacement),
    }))
  }

  if (typeof alias === 'object') {
    let normalizedAlias: AliasOptions = {}
    for (let [key, value] of Object.entries(alias)) {
      normalizedAlias[key] = normalizeAliasPath(value)
    }
    return normalizedAlias
  }

  return alias
}

/**
 * Wrapper function to normalize the tuono.config.ts file
 */
const normalizeConfig = (config: TuonoConfig): TuonoConfig => {
  return {
    ...config,
    vite: {
      alias: normalizeViteAlias(config?.vite?.alias),
    },
  }
}

export const loadConfig = async (): Promise<TuonoConfig> => {
  try {
    const configFile = await import(
      path.join(
        process.cwd(),
        DOT_TUONO_FOLDER_NAME,
        CONFIG_FOLDER_NAME,
        CONFIG_FILE_NAME,
      )
    )
    return normalizeConfig(configFile.default)
  } catch (err) {
    console.error('Failed to load tuono.config.ts')
    console.error(err)
    return {}
  }
}

export const blockingAsync = (callback: () => Promise<void>) => {
  ;(async () => {
    await callback()
  })()
}
