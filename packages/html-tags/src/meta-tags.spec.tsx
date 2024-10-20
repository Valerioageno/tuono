import * as React from 'react'
import { afterEach, describe, expect, test } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import '@testing-library/jest-dom'
import MetaContextProvider from './meta-tags-context'
import MetaTags from './meta-tags'

const MockRouter = (): React.ReactNode => {
  const [showRoute, setShowRoute] = React.useState(false)

  return (
    <MetaContextProvider>
      <button onClick={() => setShowRoute((st) => !st)}>Toggle route</button>
      {showRoute ? (
        <MetaTags>
          <title>Updated title</title>
        </MetaTags>
      ) : (
        <MetaTags>
          <title>Tuono</title>
        </MetaTags>
      )}
    </MetaContextProvider>
  )
}

describe('Should correctly render the head tags', () => {
  afterEach(() => {
    cleanup()
  })

  test('It should correctly render the head element', async () => {
    render(
      <MetaContextProvider>
        <MetaTags>
          <title>Tuono</title>
        </MetaTags>
      </MetaContextProvider>,
    )
    expect(document.title).toEqual('Tuono')
  })

  test('It should remove the properties when unmount', async () => {
    const { unmount } = render(
      <MetaContextProvider>
        <MetaTags>
          <title>Tuono</title>
        </MetaTags>
      </MetaContextProvider>,
    )
    expect(document.title).toEqual('Tuono')

    unmount()

    expect(document.title).toEqual('')
  })

  test('It should update the existing values with the newly mounted', async () => {
    const user = userEvent.setup()
    render(<MockRouter />)

    expect(document.title).toEqual('Tuono')

    await user.click(screen.getByText('Toggle route'))
    await waitFor(() => {
      expect(document.title).toEqual('Updated title')
    })

    await user.click(screen.getByText('Toggle route'))

    await waitFor(() => {
      expect(document.title).toEqual('Tuono')
    })
  })
})
