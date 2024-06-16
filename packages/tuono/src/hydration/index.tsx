import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '../router'

type RouteTree = any

export function hydrate(routeTree: RouteTree): void {
  // Create a new router instance
  const router = createRouter({ routeTree })

  // Render the app
  const rootElement = document.getElementById('__tuono')

  ReactDOM.hydrateRoot(
    rootElement,
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  )
}
