import { readFile, readdir } from 'fs/promises'
import path from 'path'
import { expect, test } from 'vitest'
import { makeCompile, splitFile } from '../src/compiler'
import { SPLIT_PREFIX } from '../src/constants'

async function splitTestFile(opts: { file: string }): Promise<void> {
  const code = (
    await readFile(path.resolve(__dirname, `./test-files/${opts.file}`))
  ).toString()

  const filename = opts.file.replace(__dirname, '')

  const result = await splitFile({
    code,
    compile: makeCompile({
      root: './test-files',
    }),
    filename: `${filename}?${SPLIT_PREFIX}`,
  })

  await expect(result.code).toMatchFileSnapshot(
    `./snapshots/${filename.replace('.tsx', '')}?split.tsx`,
  )
}

test('it compiles and splits', async (): Promise<void> => {
  // get the list of files from the /test-files directory
  const files = await readdir(path.resolve(__dirname, './test-files'))
  for (const file of files) {
    await splitTestFile({ file })
  }
})
