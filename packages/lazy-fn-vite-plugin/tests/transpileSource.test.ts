import fs from 'node:fs/promises'
import path from 'node:path'

import { it, expect, describe } from 'vitest'
import type { Plugin } from 'vite'

import { LazyLoadingPlugin } from '../src'

type ViteTransformHandler = Exclude<
  Plugin['transform'],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  Function | undefined
>['handler']

// Create a type-safe transform method
function getTransform(): (...args: Parameters<ViteTransformHandler>) => string {
  return LazyLoadingPlugin().transform as never
}

describe('"dynamic" fn', async () => {
  const folderNames = await fs.readdir(`${process.cwd()}/tests/sources`)

  it.each(folderNames)(
    'should correctly build the "%s" dynamic fn',
    async (folderName) => {
      const testDirPath = `${process.cwd()}/tests/sources/${folderName}`

      const source = await fs.readFile(
        path.join(testDirPath, 'source.tsx'),
        'utf-8',
      )

      const pluginTransform = getTransform()
      const clientBundle = pluginTransform(source, 'id')
      const serverBundle = pluginTransform(source, 'id', { ssr: true })

      const expectedClientSrc = `${testDirPath}/client.expected.tsx`
      const expectedServerSrc = `${testDirPath}/server.expected.tsx`

      await expect(clientBundle).toMatchFileSnapshot(
        expectedClientSrc,
        `${testDirPath} client build should be equal to ${expectedClientSrc}`,
      )

      await expect(serverBundle).toMatchFileSnapshot(
        expectedServerSrc,
        `${testDirPath} server build should be equal to ${expectedServerSrc}`,
      )
    },
  )
})
