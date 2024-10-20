import * as React from 'react'
import { afterEach, describe, expect, test } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import '@testing-library/jest-dom'
import MetaContextProvider from '../meta-tags-context'
import MetaTagsServer from './meta-tags-server'
import MetaTags from '../meta-tags'

describe('Should correctly render the head tags', () => {
  afterEach(() => {
    cleanup()
  })

  test('It should correctly render the html elements', () => {
    const metaTagsServer = MetaTagsServer()
    render(
      <MetaContextProvider extract={metaTagsServer.extract}>
        <MetaTags>
          <title>Tuono</title>
        </MetaTags>
      </MetaContextProvider>,
    )

    expect(metaTagsServer.renderToString()).toBe('<title>Tuono</title>')
  })
})
