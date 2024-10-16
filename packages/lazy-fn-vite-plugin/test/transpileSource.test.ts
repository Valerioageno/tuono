import { it, expect, describe } from 'vitest'
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

describe('Transpile tuono source', () => {
  it('Into the client bundle', () => {
    const bundle = LazyLoadingPlugin().transform?.(SOURCE_CODE, 'id')
    expect(bundle)
      .toBe(`import { createRoute, lazyLoadComponent as dynamic } from 'tuono';
const IndexImport = dynamic(() => import('./../src/routes/index'));
const PokemonspokemonImport = dynamic(() => import('./../src/routes/pokemons/[pokemon]'));`)
  })

  it('Into the server bundle', () => {
    const bundle = LazyLoadingPlugin().transform?.(SOURCE_CODE, 'id', {
      ssr: true,
    })
    expect(bundle).toBe(`import { createRoute } from 'tuono';
import IndexImport from "./../src/routes/index";
import PokemonspokemonImport from "./../src/routes/pokemons/[pokemon]";`)
  })
})

describe('Non tuono dynamic function', () => {
  it('Into the client bundle', () => {
    const bundle = LazyLoadingPlugin().transform?.(NON_DYNAMIC_SOURCE, 'id')
    expect(bundle).toBe(`import { createRoute } from 'tuono';
import { dynamic } from 'external-lib';
const IndexImport = dynamic(() => import('./../src/routes/index'));
const PokemonspokemonImport = dynamic(() => import('./../src/routes/pokemons/[pokemon]'));`)
  })

  it('Into the server bundle', () => {
    const bundle = LazyLoadingPlugin().transform?.(NON_DYNAMIC_SOURCE, 'id', {
      ssr: true,
    })
    expect(bundle).toBe(`import { createRoute } from 'tuono';
import { dynamic } from 'external-lib';
const IndexImport = dynamic(() => import('./../src/routes/index'));
const PokemonspokemonImport = dynamic(() => import('./../src/routes/pokemons/[pokemon]'));`)
  })
})
