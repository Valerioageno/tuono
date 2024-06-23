import 'fast-text-encoding' // Mandatory for React18
import * as React from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { RouterProvider } from '../router'
import { createRouter } from '../router'

type RouteTree = any
type Mode = 'Dev' | 'Prod'

const VITE_DEV_AND_HMR = `<script type="module">
import RefreshRuntime from 'http://localhost:3001/@react-refresh'
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
</script>
<script type="module" src="http://localhost:3001/@vite/client"></script>
<script type="module" src="http://localhost:3001/client-main.tsx"></script>`

export function serverSideRendering(routeTree: RouteTree) {
  return function render(payload: string | undefined): string {
    const props = payload ? JSON.parse(payload) : {}

    const mode = props.mode as Mode
    const router = createRouter({ routeTree }) // Render the app

    const app = renderToString(
      <RouterProvider router={router} serverProps={props} />,
    )

    return `<!doctype html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Playground</title>
    </head>
    <body>
      <div id="__tuono">${app}</div>
      ${renderToStaticMarkup(
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__TUONO_SSR_PROPS__=${payload}`,
          }}
        />,
      )}
      ${mode === 'Dev' ? VITE_DEV_AND_HMR : ''}
    </body>
  </html>
  `
  }
}
