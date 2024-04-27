import { normalize } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import type { Plugin } from 'vite'
import { makeCompile, splitFile } from './compiler'

const SPLIT_PREFIX = 'sp-'
const ROUTES_DIRECTORY_PATH = 'src/routes'
const DEBUG = true

let lock = false

export function RouterGenerator(): Plugin {
  const _generate = async () => {
    if (lock) return
    lock = true

    try {
      // TODO: generator function
      console.log('Generating [generate fn]')
    } catch (err) {
      console.log(err)
    } finally {
      lock = false
    }
  }

  const handleFile = async (file: string) => {
    const filePath = normalize(file)

    if (filePath.startsWith(ROUTES_DIRECTORY_PATH)) {
      // TODO: generator function
      console.log('Generating [handleFile fn]')
    }
  }

  return {
    name: 'vite-plugin-fs-router-generator',
    watchChange: async (file: string, context: { event: string }) => {
      if (['create', 'update', 'delete'].includes(context.event)) {
        await handleFile(file)
      }
    },
  }
}

export function RouterCodeSplitter(): Plugin {
  return {
    name: 'vite-plugin-fs-router-code-splitter',
    enforce: 'pre',
    resolveId(source) {
      if (source.startsWith(SPLIT_PREFIX + ':')) {
        return source.replace(SPLIT_PREFIX + ':', '')
      }
      return
    },
    async transform(code, id) {
      const url = pathToFileURL(id)
      url.searchParams.delete('v')
      id = fileURLToPath(url).replace(/\\/g, '/')

      const compile = makeCompile()
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

export function ViteFsRouter(): Array<Plugin> {
  return [RouterGenerator(), RouterCodeSplitter()]
}
