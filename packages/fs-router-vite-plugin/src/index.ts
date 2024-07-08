import { fileURLToPath, pathToFileURL } from 'url'
import { routeGenerator } from './routes-generator'

import { normalize } from 'path'
// eslint-disable-next-line sort-imports
import { makeCompile, splitFile } from './compiler'
import { SPLIT_PREFIX } from './constants'

import type { Plugin } from 'vite'

const ROUTES_DIRECTORY_PATH = './src/routes'

let lock = false

export function RouterGenerator(): Plugin {
  const generate = async (): Promise<void> => {
    if (lock) return
    lock = true

    try {
      // TODO: generator function
      await routeGenerator()
    } catch (err) {
    } finally {
      lock = false
    }
  }

  const handleFile = async (file: string): Promise<void> => {
    const filePath = normalize(file)

    if (filePath.startsWith(ROUTES_DIRECTORY_PATH)) {
      // TODO: generator function
      await generate()
    }
  }

  return {
    name: 'vite-plugin-tuono-fs-router-generator',
    configResolved: async (): Promise<void> => {
      await generate()
    },
    watchChange: async (
      file: string,
      context: { event: string },
    ): Promise<void> => {
      if (['create', 'update', 'delete'].includes(context.event)) {
        await handleFile(file)
      }
    },
  }
}

export function RouterCodeSplitter(): Plugin {
  const ROOT: string = process.cwd()

  return {
    name: 'vite-plugin-tuono-fs-router-code-splitter',
    enforce: 'pre',
    resolveId(source): string | null {
      if (source.startsWith(SPLIT_PREFIX + ':')) {
        return source.replace(SPLIT_PREFIX + ':', '')
      }
      return null
    },
    async transform(code, id): Promise<any> {
      const url = pathToFileURL(id)
      url.searchParams.delete('v')
      id = fileURLToPath(url).replace(/\\/g, '/')

      const compile = makeCompile({ root: ROOT })

      if (id.includes(SPLIT_PREFIX)) {
        const compiled = await splitFile({
          code,
          compile,
          filename: id,
        })

        return compiled
      }

      return null
    },
  }
}

export function ViteFsRouter(): Plugin[] {
  return [RouterGenerator(), RouterCodeSplitter()]
}
