import fs from 'fs/promises'
import { describe, it, expect } from 'vitest'
import { routeGenerator } from '../src/generator'

function makeFolderDir(folder: string) {
  return process.cwd() + `/tests/generator/${folder}`
}

async function getRouteTreeFileText(folder: string) {
  const dir = makeFolderDir(folder)
  return await fs.readFile(dir + '/routeTree.gen.ts', 'utf-8')
}

async function getExpectedRouteTreeFileText(folder: string) {
  const dir = makeFolderDir(folder)
  const location = dir + '/routeTree.expected.ts'
  return await fs.readFile(location, 'utf-8')
}

describe('generator works', async () => {
  const folderNames = await fs.readdir(process.cwd() + '/tests/generator')

  it.each(folderNames.map((folder) => [folder]))(
    'should wire-up the routes for a "%s" tree',
    async (folderName) => {
      const currentFolder = `${process.cwd()}/tests/generator/${folderName}`

      await routeGenerator({
        folderName: `${currentFolder}/routes`,
        generatedRouteTree: `${currentFolder}/routeTree.gen.ts`,
      })

      const [expectedRouteTree, generatedRouteTree] = await Promise.all([
        getExpectedRouteTreeFileText(folderName),
        getRouteTreeFileText(folderName),
      ])

      console.log(generatedRouteTree)

      expect(generatedRouteTree).equal(expectedRouteTree)
    },
  )
})
