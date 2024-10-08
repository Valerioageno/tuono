import { it, expect, describe } from 'vitest'
import { LazyLoadingPlugin } from '../src'

const SOURCE_CODE = `
import { createRoute, dynamic } from 'tuono'

const IndexImport = dynamic(() => import('./../src/routes/index'))
const PokemonspokemonImport = dynamic(
  () => import('./../src/routes/pokemons/[pokemon]'),
)
`

const CLIENT_RESULT = `import { createRoute, lazyLoadComponent as dynamic } from 'tuono';
const IndexImport = dynamic(() => import('./../src/routes/index'));
const PokemonspokemonImport = dynamic(() => import('./../src/routes/pokemons/[pokemon]'));`

const SERVER_RESULT = `import { createRoute } from 'tuono';
import IndexImport from "./../src/routes/index";
import PokemonspokemonImport from "./../src/routes/pokemons/[pokemon]";`

describe('Transpile tuono source', () => {
  it('Into the client bundle', () => {
    const bundle = LazyLoadingPlugin().transform?.(SOURCE_CODE, 'id')
    expect(bundle).toBe(CLIENT_RESULT)
  })

  it('Into the server bundle', () => {
    const bundle = LazyLoadingPlugin().transform?.(SOURCE_CODE, 'id', {
      ssr: true,
    })
    expect(bundle).toBe(SERVER_RESULT)
  })
})
