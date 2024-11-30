import { it, expect, describe } from 'vitest'
import type { Plugin } from 'vite'

import { LazyLoadingPlugin } from '../src'

const SOURCE_CODE = `
import { createRoute, dynamic } from 'tuono'

const IndexImport = dynamic(() => import('./../src/routes/index'))
const PokemonspokemonImport = dynamic(
  () => import('./../src/routes/pokemons/[pokemon]'),
)
`

const NON_DYNAMIC_SOURCE = `
import { createRoute } from 'tuono'
import {dynamic} from 'external-lib'

const IndexImport = dynamic(() => import('./../src/routes/index'))
const PokemonspokemonImport = dynamic(
  () => import('./../src/routes/pokemons/[pokemon]'),
)
`

type ViteTransformHandler = Exclude<
  Plugin['transform'],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  Function | undefined
>['handler']

// Create a type-safe transform method
function getTransform(): (...args: Parameters<ViteTransformHandler>) => string {
  return LazyLoadingPlugin().transform as never
}

describe('Transpile tuono source', () => {
  it('Into the client bundle', () => {
    const pluginTransform = getTransform()
    const bundle = pluginTransform(SOURCE_CODE, 'id')
    expect(bundle)
      .toBe(`import { createRoute, lazyLoadComponent as dynamic } from 'tuono';
const IndexImport = dynamic(() => import('./../src/routes/index'));
const PokemonspokemonImport = dynamic(() => import('./../src/routes/pokemons/[pokemon]'));`)
  })

  it('Into the server bundle', () => {
    const pluginTransform = getTransform()
    const bundle = pluginTransform(SOURCE_CODE, 'id', {
      ssr: true,
    })
    expect(bundle).toBe(`import { createRoute } from 'tuono';
import IndexImport from "./../src/routes/index";
import PokemonspokemonImport from "./../src/routes/pokemons/[pokemon]";`)
  })
})

describe('Non tuono dynamic function', () => {
  it('Into the client bundle', () => {
    const pluginTransform = getTransform()
    const bundle = pluginTransform(NON_DYNAMIC_SOURCE, 'id')
    expect(bundle).toBe(`import { createRoute } from 'tuono';
import { dynamic } from 'external-lib';
const IndexImport = dynamic(() => import('./../src/routes/index'));
const PokemonspokemonImport = dynamic(() => import('./../src/routes/pokemons/[pokemon]'));`)
  })

  it('Into the server bundle', () => {
    const pluginTransform = getTransform()
    const bundle = pluginTransform(NON_DYNAMIC_SOURCE, 'id', {
      ssr: true,
    })
    expect(bundle).toBe(`import { createRoute } from 'tuono';
import { dynamic } from 'external-lib';
const IndexImport = dynamic(() => import('./../src/routes/index'));
const PokemonspokemonImport = dynamic(() => import('./../src/routes/pokemons/[pokemon]'));`)
  })
})
