import { fileURLToPath, pathToFileURL } from 'url'
import { routeGenerator } from 'tuono-routes-generator'

import { normalize } from 'path'
// eslint-disable-next-line sort-imports
import { makeCompile, splitFile } from './compiler'
import { SPLIT_PREFIX } from './constants'

import type { Plugin } from 'vite'

const ROUTES_DIRECTORY_PATH = './src/routes'
const DEBUG = true

let lock = false

export function RouterGenerator(): Plugin {
  const generate = async (): Promise<void> => {
    if (lock) return
    lock = true

    try {
      // TODO: generator function
      console.log('Generating [generate fn]')
      await routeGenerator()
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
  console.log('ROOT', ROOT)

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

      if (DEBUG) console.info('Route: ', id)

      if (id.includes(SPLIT_PREFIX)) {
        console.log('Split')
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
      } else {
        console.log('Non split')
      }

      return null
    },
  }
}

export function ViteFsRouter(): Plugin[] {
  return [RouterGenerator(), RouterCodeSplitter()]
}
