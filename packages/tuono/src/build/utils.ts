import type { AliasOptions } from 'vite'
import type { TuonoConfig } from '../config'
import path from 'path'

const DOT_TUONO = '.tuono'
const CONFIG_FOLDER = 'config'
const CONFIG_FILE = 'config.mjs'

/**
 * Sanitize the vite alias:
 * - If the path is a relative path transfrorm it to absolute applying the tuono root folder
 * - If the path is absolute remove the ".tuono/config/" path from it
 */
const cleanAliasPath = (filePath: string): string => {
  if (path.isAbsolute(filePath)) {
    return filePath.replace(path.join(DOT_TUONO, CONFIG_FOLDER), '')
  } else {
    return path.join(process.cwd(), filePath)
  }
}

/**
 * Iterator over the config.vite.alias entry
 */
const sanitizeViteAlias = (alias?: AliasOptions): AliasOptions | undefined => {
  if (!alias) return

  if (Array.isArray(alias)) {
    return alias.map(({ find, replacement }) => ({
      find,
      replacement: cleanAliasPath(replacement),
    }))
  }
  if (typeof alias === 'object') {
    let object: AliasOptions = {}
    for (let [key, value] of Object.entries(alias)) {
      object[key] = cleanAliasPath(value)
    }
    return object
  }

  return alias
}

/**
 * Wrapper function to sanitize the tuono.config.ts file
 */
const sanitizeConfig = (config: TuonoConfig): TuonoConfig => {
  return {
    ...config,
    vite: {
      alias: sanitizeViteAlias(config?.vite?.alias),
    },
  }
}

export const loadConfig = async (): Promise<TuonoConfig> => {
  try {
    const configFile = await import(
      path.join(process.cwd(), DOT_TUONO, CONFIG_FOLDER, CONFIG_FILE)
    )
    return sanitizeConfig(configFile.default)
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
