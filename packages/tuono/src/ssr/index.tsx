import 'fast-text-encoding' // Mandatory for React18
import * as React from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import MetaTagsServer from 'react-meta-tags/server'
import { MetaTagsContext } from 'react-meta-tags'
import { RouterProvider, createRouter } from 'tuono-router'

type RouteTree = any
type Mode = 'Dev' | 'Prod'

const TUONO_DEV_SERVER_PORT = 3000
const VITE_PROXY_PATH = '/vite-server'

const VITE_DEV_AND_HMR = `<script type="module">
import RefreshRuntime from 'http://localhost:${TUONO_DEV_SERVER_PORT}${VITE_PROXY_PATH}/@react-refresh'
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
</script>
<script type="module" src="http://localhost:${TUONO_DEV_SERVER_PORT}${VITE_PROXY_PATH}/@vite/client"></script>
<script type="module" src="http://localhost:${TUONO_DEV_SERVER_PORT}${VITE_PROXY_PATH}/client-main.tsx"></script>`

function generateCssLinks(cssBundles: string[], mode: Mode): string {
  if (mode === 'Dev') return ''
  return cssBundles.reduce((acc, value) => {
    return acc + `<link rel="stylesheet" type="text/css" href="/${value}" />`
  }, '')
}

function generateJsScripts(jsBundles: string[], mode: Mode): string {
  if (mode === 'Dev') return ''
  return jsBundles.reduce((acc, value) => {
    return acc + `<script type="module" src="/${value}"></script>`
  }, '')
}

export function serverSideRendering(routeTree: RouteTree) {
  return function render(payload: string | undefined): string {
    const props = payload ? JSON.parse(payload) : {}

    const mode = props.mode as Mode
    const jsBundles = props.jsBundles as string[]
    const cssBundles = props.cssBundles as string[]
    const router = createRouter({ routeTree }) // Render the app

    const metaTagsInstance = MetaTagsServer()

    const app = renderToString(
      <MetaTagsContext extract={metaTagsInstance.extract}>
        <RouterProvider router={router} serverProps={props} />
      </MetaTagsContext>,
    )

    const metaTags = metaTagsInstance.renderToString()

    return `<!doctype html>
  <html>
    <head>
	  ${metaTags}
	  ${generateCssLinks(cssBundles, mode)}
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
	  ${generateJsScripts(jsBundles, mode)}
      ${mode === 'Dev' ? VITE_DEV_AND_HMR : ''}
    </body>
  </html>
  `
  }
}
