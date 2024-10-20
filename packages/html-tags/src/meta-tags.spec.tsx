import * as React from 'react'
import { afterEach, describe, expect, test } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import '@testing-library/jest-dom'
import MetaContextProvider from './meta-tags-context'
import MetaTags from './meta-tags'

describe('Should correctly render the head tags', () => {
  afterEach(() => {
    cleanup()
  })

  test('It should correctly render the head element', async () => {
    await React.act(async () => {
      render(
        <MetaContextProvider>
          <MetaTags>
            <title>Tuono</title>
          </MetaTags>
        </MetaContextProvider>,
      )
    })
    expect(document.title).toEqual('Tuono')
  })
})
