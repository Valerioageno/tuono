import { fileURLToPath, pathToFileURL } from 'url'

import { normalize } from 'path'
// eslint-disable-next-line sort-imports
import { makeCompile, splitFile } from './compiler'
import { SPLIT_PREFIX } from './constants'

import type { Plugin } from 'vite'

const ROUTES_DIRECTORY_PATH = 'src/routes'
const DEBUG = true

let lock = false

export function RouterGenerator(): Plugin {
  const generate = async (): Promise<void> => {
    if (lock) return
    lock = true

    try {
      // TODO: generator function
      // This generator function is from the router-generator package
      console.log('Generating [generate fn]')
    } catch (err) {
      console.log(err)
    } finally {
      lock = false
    }
  }

  const handleFile = async (file: string): Promise<void> => {
    const filePath = normalize(file)

    if (filePath.startsWith(ROUTES_DIRECTORY_PATH)) {
      // TODO: generator function
      console.log('Generating [handleFile fn]')
      await generate()
    }
  }

  return {
    name: 'vite-plugin-fs-router-generator',
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
    name: 'vite-plugin-fs-router-code-splitter',
    enforce: 'pre',
    resolveId(source): string {
      if (source.startsWith(SPLIT_PREFIX + ':')) {
        return source.replace(SPLIT_PREFIX + ':', '')
      }
      return ''
    },
    async transform(code, id): Promise<void> {
      const url = pathToFileURL(id)
      url.searchParams.delete('v')
      id = fileURLToPath(url).replace(/\\/g, '/')

      const compile = makeCompile({ root: ROOT })

      if (DEBUG) console.info('Route: ', id)

      if (id.includes(SPLIT_PREFIX)) {
        if (DEBUG) console.info('Splitting route: ', id)

        const compiled = await splitFile({
          code,
          compile,
          filename: id,
        })

        if (DEBUG) {
          console.info('')
          console.info('Split Output')
          console.info('')
          //console.info(compiled.code)
          console.info('')
          console.info('')
          console.info('')
          console.info('')
          console.info('')
          console.info('')
          console.info('')
          console.info('')
        }

        return compiled
      }
    },
  }
}

export function ViteFsRouter(): Plugin[] {
  return [RouterGenerator(), RouterCodeSplitter()]
}
