import { describe, expect, it, vi } from 'vitest'

import type { TuonoConfig } from '../config'

import { loadConfig, normalizeConfig } from './utils'

const PROCESS_CWD_MOCK = 'PROCESS_CWD_MOCK'

vi.spyOn(process, 'cwd').mockReturnValue(PROCESS_CWD_MOCK)

describe('loadConfig', () => {
  it('should error if the config does not exist', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    await loadConfig()

    expect(consoleErrorSpy).toHaveBeenCalledTimes(2)
  })
})

describe('normalizeConfig - vite - alias', () => {
  it('should return the config as is, adding `vite` with alias', () => {
    const config: TuonoConfig = {}
    expect(normalizeConfig(config)).toStrictEqual({
      vite: { alias: undefined },
    })
  })

  it('should return an empty config if invalid values are provided', () => {
    // @ts-expect-error testing invalid config
    expect(normalizeConfig({ invalid: true })).toStrictEqual({
      vite: { alias: undefined },
    })
  })

  it('should not modify alias pointing to packages', () => {
    const libraryName = '@tabler/icons-react'
    const libraryAlias = '@tabler/icons-react/dist/esm/icons/index.mjs'
    const config: TuonoConfig = {
      vite: { alias: { [libraryName]: libraryAlias } },
    }
    expect(normalizeConfig(config)).toMatchInlineSnapshot(`
      {
        "vite": {
          "alias": {
            "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
          },
        },
      }
    `)
  })

  it('should transform relative paths to absolute path relative to process.cwd()', () => {
    const config: TuonoConfig = {
      vite: { alias: { '@': './src', '@no-prefix': 'src' } },
    }

    expect(normalizeConfig(config)).toMatchInlineSnapshot(`
      {
        "vite": {
          "alias": {
            "@": "PROCESS_CWD_MOCK/src",
            "@no-prefix": "PROCESS_CWD_MOCK/src",
          },
        },
      }
    `)
  })

  it('should not transform alias with absolute path', () => {
    const config: TuonoConfig = {
      vite: { alias: { '@1': '/src/pippo', '@2': 'file://pluto' } },
    }
    expect(normalizeConfig(config)).toMatchInlineSnapshot(`
      {
        "vite": {
          "alias": {
            "@1": "/src/pippo",
            "@2": "file://pluto",
          },
        },
      }
    `)
  })

  it('should apply previuos behaviuor when using alias as list', () => {
    const config: TuonoConfig = {
      vite: {
        alias: [
          { find: '1', replacement: '@tabler/icons-react-fun' },
          { find: '2', replacement: './src' },
          { find: '3', replacement: 'file://pluto' },
        ],
      },
    }
    expect(normalizeConfig(config)).toMatchInlineSnapshot(`
      {
        "vite": {
          "alias": [
            {
              "find": "1",
              "replacement": "@tabler/icons-react-fun",
            },
            {
              "find": "2",
              "replacement": "PROCESS_CWD_MOCK/src",
            },
            {
              "find": "3",
              "replacement": "file://pluto",
            },
          ],
        },
      }
    `)
  })
})
