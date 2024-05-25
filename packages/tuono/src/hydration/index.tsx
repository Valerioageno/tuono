import 'vite/modulepreload-polyfill'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '../router'

export function hydrate(routeTree: any) {
  // Create a new router instance
  const router = createRouter({ routeTree })

  // Render the app
  const rootElement = document.getElementById('__tuono')!

  ReactDOM.hydrateRoot(
    rootElement,
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  )
}
